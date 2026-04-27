// src/pages/guest/index.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer, BackButton } from "@components/common";
import GuestSearchBar from "@components/guest/GuestSearchBar";
import GuestTable from "@components/guest/GuestTable";
import GuestActions from "@components/guest/GuestActions";
import { getGuests, getGuestByRequestId } from "@services/api/guestAPI"; // ← confirmGuest removed
import { createAndPrintGuestTicket } from "@services/print/printService";
import { useUser } from "@context/UserContext";
import usePrint from "@hooks/usePrint";
import useScanner from "@hooks/useScanner";

const GuestPage = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showNumPad, setShowNumPad] = useState(false);
  const [guests, setGuests] = useState([]);
  const [displayGuests, setDisplayGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { print, isPrinting } = usePrint();
  const { user } = useUser();

  const backTo = user?.userType === "staff" ? "/staff-home" : "/home";

  useEffect(() => {
    async function fetchGuests() {
      try {
        setLoading(true);
        const data = await getGuests();
        setGuests(data);
        setDisplayGuests(data);
      } catch (err) {
        setError("Failed to load guests.");
      } finally {
        setLoading(false);
      }
    }
    fetchGuests();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setDisplayGuests(guests);
      setError(null);
    }
  }, [search, guests]);

  const lookupByRequestId = async (value) => {
    try {
      setSearchLoading(true);
      setError(null);
      const result = await getGuestByRequestId(value);
      if (result.length) {
        setDisplayGuests(result);
      } else {
        setDisplayGuests([]);
        setError("No guest found for this Request ID.");
      }
    } catch {
      setDisplayGuests([]);
      setError("No guest found for this Request ID.");
    } finally {
      setSearchLoading(false);
    }
  };

  useScanner({
    onScan: async (scanned) => {
      const value = scanned.trim();
      if (!value) return;
      setSearch(value);
      setSelectedId(null);
      setShowNumPad(false);
      await lookupByRequestId(value);
    },
    minLength: 3,
  });

  const handleSearchSubmit = async () => {
    setShowNumPad(false);
    const query = search.trim();
    if (!query) return;

    const isNumeric = /^\d+$/.test(query);

    if (isNumeric) {
      await lookupByRequestId(query);
    } else {
      const lower = query.toLowerCase();
      const filtered = guests.filter((g) => {
        const name = g?.guestDetails?.name ?? g?.guestName ?? "";
        return name.toLowerCase().includes(lower);
      });
      setDisplayGuests(filtered);
      if (!filtered.length) setError("No guests found matching that name.");
    }
  };

  // ── Print: questQrCodes from getAll drives ticket count & QR values ──────────
  const handlePrint = async () => {
    const guest = displayGuests.find((g) => g.requestId === selectedId);
    if (!guest) return;

    try {
      await createAndPrintGuestTicket({
        requestId: guest.requestId,
        guestDetails: guest.guestDetails,
        hostDetails: guest.hostDetails,
        print,
      });
    } catch (err) {
      console.error("[GuestPage] Print failed:", err);
      setError("Failed to print ticket. Please try again.");
      return;
    }

    navigate("/login");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Header />
      <BackButton to={backTo} />

      <GuestSearchBar
        value={search}
        onChange={(val) => {
          setSearch(val);
          setSelectedId(null);
        }}
        showNumPad={showNumPad}
        setShowNumPad={setShowNumPad}
        onEnter={handleSearchSubmit}
      />

      {!showNumPad && (
        <GuestTable
          selectedId={selectedId}
          onSelect={setSelectedId}
          search=""
          guests={displayGuests}
          loading={loading || searchLoading}
          error={error}
        />
      )}

      <GuestActions
        canPrint={!!selectedId && !isPrinting}
        onPrint={handlePrint}
        onCancel={() => navigate(backTo, { replace: true })}
        reqId={selectedId}
      />

      <Footer />
    </div>
  );
};

export default GuestPage;
