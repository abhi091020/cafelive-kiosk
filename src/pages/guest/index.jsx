// src/pages/guest/index.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer, BackButton } from "@components/common";
import GuestSearchBar from "@components/guest/GuestSearchBar";
import GuestTable from "@components/guest/GuestTable";
import GuestActions from "@components/guest/GuestActions";

const GuestPage = () => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showNumPad, setShowNumPad] = useState(false);
  const navigate = useNavigate();

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

      {/* ── BACK BUTTON ── */}
      <BackButton to="/home" />

      <GuestSearchBar
        value={search}
        onChange={setSearch}
        showNumPad={showNumPad}
        setShowNumPad={setShowNumPad}
        onEnter={() => setShowNumPad(false)}
      />
      {/* ── Hide table while NumPad is open ── */}
      {!showNumPad && (
        <GuestTable
          selectedId={selectedId}
          onSelect={setSelectedId}
          search={search}
        />
      )}

      <GuestActions
        canPrint={!!selectedId}
        onPrint={() => {}}
        onCancel={() => navigate(-1)}
      />

      <Footer />
    </div>
  );
};

export default GuestPage;
