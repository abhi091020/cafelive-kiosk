// src/components/guest/GuestTable.jsx

import { useTranslation } from "react-i18next";

const ROWS = 15;

const PLACEHOLDER_IDS = [
  1234, 1580, 6789, 3456, 8765, 3452, 2341, 5678, 9012, 4321, 7890, 6543, 2109,
  5432, 1357,
];
const PLACEHOLDER_NAMES = [
  "Rahul Pardeshi", "Tushar Kumavat", "Saurabh Bhalerao", "Pratik Patil",
  "Ketan Patil", "Lalit Beldar", "Amit Sharma", "Rohan Desai",
  "Nikhil Jadhav", "Sachin More", "Vishal Kulkarni", "Priya Nair",
  "Deepak Yadav", "Sneha Joshi", "Manoj Tiwari",
];
const PLACEHOLDER_COMPANIES = [
  "Hatts Of Digital", "Daccess Security System", "Brawizz Tech Pvt", "TATA",
  "Bosch", "Suprim Pvt", "Infosys", "Wipro", "HCL Technologies",
  "Tech Mahindra", "Cognizant", "Capgemini", "L&T Infotech",
  "Persistent Systems", "Mphasis",
];
const PLACEHOLDER_HOSTS = [
  "Pratik Kale", "Tushar Patil", "Raj Shinde", "Jignesh Roy", "Pratik Kale",
  "Pratik Kale", "Sanjay Mehta", "Vikram Nair", "Anita Kulkarni",
  "Suresh Yadav", "Ravi Sharma", "Pooja Desai", "Anil Joshi",
  "Kavita More", "Rahul Singh",
];
const PLACEHOLDER_DEPTS = [
  "IT Department", "Sales Department", "IT Department", "IT Department",
  "IT Department", "IT Department", "HR Department", "Finance Department",
  "IT Department", "Operations", "Marketing", "IT Department",
  "Admin Department", "Sales Department", "IT Department",
];

const ALL_ROWS = Array.from({ length: ROWS }).map((_, idx) => ({
  id:      PLACEHOLDER_IDS[idx],
  name:    PLACEHOLDER_NAMES[idx],
  company: PLACEHOLDER_COMPANIES[idx],
  host:    PLACEHOLDER_HOSTS[idx],
  dept:    PLACEHOLDER_DEPTS[idx],
}));

const GuestTable = ({ selectedId, onSelect, search = "" }) => {
  const { t } = useTranslation();

  const filtered = ALL_ROWS.filter((row) =>
    String(row.id).startsWith(search)
  );

  return (
    <>
      <div className="guest-table-wrapper">
        {/* ── Header ── */}
        <div className="guest-table-header">
          <span className="guest-th">{t("guest.srNo")}</span>
          <span className="guest-th">{t("guest.requestId")}</span>
          <span className="guest-th">{t("guest.guestDetails")}</span>
          <span className="guest-th">{t("guest.hostDetails")}</span>
        </div>

        {/* ── Rows ── */}
        {filtered.length === 0 ? (
          <div className="guest-table-empty">{t("guest.noGuestsFound")}</div>
        ) : (
          filtered.map((row, idx) => (
            <div
              key={row.id}
              className={`guest-table-row ${selectedId === row.id ? "guest-table-row--selected" : ""}`}
              onClick={() => onSelect(selectedId === row.id ? null : row.id)}
            >
              <span className="guest-td-num">
                {String(idx + 1).padStart(2, "0")}.
              </span>
              <span className="guest-td-primary">{row.id}</span>
              <div className="guest-td-col">
                <span className="guest-td-primary">{row.name}</span>
                <span className="guest-td-secondary">{row.company}</span>
              </div>
              <div className="guest-td-col">
                <span className="guest-td-primary">{row.host}</span>
                <span className="guest-td-secondary">{row.dept}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .guest-table-wrapper {
          position: absolute;
          top: calc(max(70px, 10vh) + clamp(70px, 10vh, 110px));
          left: clamp(60px, 9vw, 160px);
          width: clamp(250px, 84vw, 900px);
          border-radius: clamp(8px, 1vw, 12px);
          overflow: hidden;
          box-shadow: 0 2px 14px rgba(0,0,0,0.10);
          background: #FFFFFF;
          z-index: 10;
        }

        .guest-table-header {
          display: grid;
          grid-template-columns: 80px 120px 1fr 1fr;
          background: #EA4D4E;
          height: clamp(52px, 6.5vh, 68px);
          align-items: center;
          padding: 0 clamp(12px, 2vw, 20px);
          gap: clamp(8px, 1vw, 16px);
        }

        .guest-th {
          color: #FFFFFF;
          font-weight: 700;
          font-size: clamp(14px, 1.6vw, 19px);
          letter-spacing: 0.03em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .guest-table-row {
          display: grid;
          grid-template-columns: 80px 120px 1fr 1fr;
          padding: 0 clamp(12px, 2vw, 20px);
          gap: clamp(8px, 1vw, 16px);
          align-items: center;
          min-height: clamp(62px, 7.5vh, 74px);
          background: #FFFFFF;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          cursor: pointer;
          transition: background 0.15s;
        }

        .guest-table-row:last-child { border-bottom: none; }
        .guest-table-row:hover { background: rgba(234, 77, 78, 0.05); }
        .guest-table-row--selected { background: rgba(234, 77, 78, 0.12) !important; }

        .guest-td-num {
          color: #570000;
          font-size: clamp(18px, 2.2vw, 28px);
          font-weight: 500;
        }

        .guest-td-primary {
          color: #570000;
          font-size: clamp(18px, 2.2vw, 28px);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .guest-td-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .guest-td-secondary {
          color: #999999;
          font-size: clamp(13px, 1.4vw, 17px);
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .guest-table-empty {
          padding: clamp(24px, 4vh, 40px);
          text-align: center;
          color: #999999;
          font-size: clamp(14px, 1.5vw, 18px);
          background: #fff;
        }
      `}</style>
    </>
  );
};

export default GuestTable;