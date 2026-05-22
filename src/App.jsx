import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const ref = useRef();

  /* ================= 기본 정보 ================= */
  const [form, setForm] = useState({
    name: "",
    dept: "",
    position: "조교수/연구원/학생",
    type: "국내",
    transport: "자동차",
    start: "",
    end: "",
  });

  /* ================= 비용 ================= */
  const [cost, setCost] = useState({
    lodging: 0,
    toll: 0,
    parking: 0,
    air: 0,
    airParking: 0,
    train: 0,
    bus: 0,
    etc: 0,
  });

  /* ================= 날짜 계산 ================= */
  const days =
    form.start && form.end
      ? Math.max(
          1,
          Math.ceil(
            (new Date(form.end) -
              new Date(form.start)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const isOneDay = days === 1;

  /* ================= 권한 ================= */
  const isProfessor =
    form.position === "교수/부교수";

  /* ================= 식비/일비 ================= */
  const meal = days * 25000;
  const daily = days * 25000;

  /* ================= 숙박 기준 ================= */
  const lodgingStandard = {
    서울: 100000,
    광역시: 80000,
    기타: 70000,
  };

  const lodgingValue =
    isProfessor
      ? Number(cost.lodging || 0) // 실비
      : isOneDay
      ? 0
      : Number(cost.lodging || 0);

  /* ================= 교통비 ================= */
  const transportTotal = (() => {
    switch (form.transport) {
      case "자동차":
        return (
          Number(cost.toll || 0) +
          Number(cost.parking || 0)
        );
      case "항공":
        return (
          Number(cost.air || 0) +
          Number(cost.airParking || 0)
        );
      case "기차":
        return Number(cost.train || 0);
      case "버스":
        return Number(cost.bus || 0);
      default:
        return Number(cost.etc || 0);
    }
  })();

  /* ================= 총액 ================= */
  const total =
    meal + daily + lodgingValue + transportTotal;

  /* ================= 저장 ================= */
  const saveImage = async () => {
    const canvas = await html2canvas(ref.current, {
      scale: 2,
    });

    const a = document.createElement("a");
    a.download = "출장비신청서.png";
    a.href = canvas.toDataURL();
    a.click();
  };

  const savePDF = async () => {
    const canvas = await html2canvas(ref.current, {
      scale: 2,
    });

    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const w =
      pdf.internal.pageSize.getWidth();
    const h =
      (canvas.height * w) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save("출장비신청서.pdf");
  };

  return (
    <div style={bg}>
      <div style={wrap} ref={ref}>
        <Header />

        {/* ================= 기본 정보 ================= */}
        <Section title="기본 정보">
          <Grid>
            <Input
              label="이름"
              value={form.name}
              onChange={(v) =>
                setForm({ ...form, name: v })
              }
            />
            <Input
              label="소속"
              value={form.dept}
              onChange={(v) =>
                setForm({ ...form, dept: v })
              }
            />
            <Select
              label="직급"
              value={form.position}
              onChange={(v) =>
                setForm({
                  ...form,
                  position: v,
                })
              }
              options={[
                "교수/부교수",
                "조교수/연구원/학생",
              ]}
            />
            <Select
              label="출장구분"
              value={form.type}
              onChange={(v) =>
                setForm({ ...form, type: v })
              }
              options={["국내", "해외"]}
            />
            <Select
              label="교통수단"
              value={form.transport}
              onChange={(v) =>
                setForm({
                  ...form,
                  transport: v,
                })
              }
              options={[
                "자동차",
                "항공",
                "기차",
                "버스",
                "기타",
              ]}
            />

            {/* 📅 날짜 (복구 완료) */}
            <Input
              label="시작일"
              type="date"
              value={form.start}
              onChange={(v) =>
                setForm({
                  ...form,
                  start: v,
                })
              }
            />
            <Input
              label="종료일"
              type="date"
              value={form.end}
              onChange={(v) =>
                setForm({
                  ...form,
                  end: v,
                })
              }
            />
          </Grid>
        </Section>

        {/* ================= 식비 ================= */}
        <Section title="식비 / 일비">
          <Grid>
            <Card title="식비" value={meal} />
            <Card title="일비" value={daily} />
          </Grid>
        </Section>

        {/* ================= 숙박 ================= */}
        <Section title="숙박비">
          <Grid>
            <Input
              label={
                isProfessor
                  ? "숙박비 (실비)"
                  : "숙박비"
              }
              value={cost.lodging}
              onChange={(v) =>
                setCost({
                  ...cost,
                  lodging: v,
                })
              }
            />
          </Grid>

          <Info>
            교수/부교수: 실비 지급 / 일반: 서울 10만, 광역시 8만, 기타 7만
            {isOneDay && " / 당일치기 제외"}
          </Info>
        </Section>

        {/* ================= 교통 ================= */}
        <Section title="교통비">
          <Grid>
            <Input
              label="항공비"
              value={cost.air}
              onChange={(v) =>
                setCost({
                  ...cost,
                  air: v,
                })
              }
            />
            <Input
              label="항공 주차비"
              value={cost.airParking}
              onChange={(v) =>
                setCost({
                  ...cost,
                  airParking: v,
                })
              }
            />
            <Input
              label="톨게이트"
              value={cost.toll}
              onChange={(v) =>
                setCost({
                  ...cost,
                  toll: v,
                })
              }
            />
            <Input
              label="주차비"
              value={cost.parking}
              onChange={(v) =>
                setCost({
                  ...cost,
                  parking: v,
                })
              }
            />
          </Grid>
        </Section>

        {/* ================= 정산 ================= */}
        <Section title="정산 요약">
          <Summary>
            <Card title="식비" value={meal} />
            <Card title="일비" value={daily} />
            <Card title="숙박" value={lodgingValue} />
            <Card title="교통" value={transportTotal} />
            <Card title="총액" value={total} highlight />
          </Summary>
        </Section>

        {/* ================= 버튼 ================= */}
        <div style={btnWrap}>
          <button style={btn} onClick={saveImage}>
            이미지 저장
          </button>
          <button style={btn} onClick={savePDF}>
            PDF 저장
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function Header() {
  return <div style={header}>출장비 자동 정산 시스템</div>;
}

function Section({ title, children }) {
  return (
    <div style={section}>
      <h2 style={sectionTitle}>{title}</h2>
      <div style={box}>{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type }) {
  return (
    <div style={field}>
      <label>{label}</label>
      <input
        type={type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={input}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={field}>
      <label>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={input}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Card({ title, value, highlight }) {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 10,
        background: highlight ? "#dbeafe" : "#f8fafc",
        minWidth: 120,
        textAlign: "center",
      }}
    >
      <div>{title}</div>
      <div style={{ fontWeight: "bold" }}>
        {Number(value || 0).toLocaleString()}원
      </div>
    </div>
  );
}

/* ================= 정산 1줄 고정 ================= */
function Summary({ children }) {
  return <div style={summary}>{children}</div>;
}

/* ================= STYLE ================= */

const bg = { background: "#f1f5f9", minHeight: "100vh", padding: 20 };

const wrap = { maxWidth: 900, margin: "auto", background: "#fff", padding: 20, borderRadius: 12 };

const header = { textAlign: "center", fontSize: 22, fontWeight: "bold" };

const section = { marginTop: 20 };

const sectionTitle = { fontSize: 18, fontWeight: "bold", color: "#1e3a8a" };

const box = { border: "1px solid #ddd", padding: 12, borderRadius: 10 };

const field = { display: "flex", flexDirection: "column", alignItems: "center" };

const input = { width: 160, padding: 8, textAlign: "center" };

/* 1줄 유지 핵심 */
const summary = {
  display: "flex",
  flexWrap: "nowrap",
  overflowX: "auto",
  gap: 10,
  justifyContent: "space-between",
};

const btnWrap = { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 };

const btn = { padding: 10, background: "#2563eb", color: "#fff", border: "none", borderRadius: 8 };

const Info = ({ children }) => (
  <div style={{ fontSize: 12, color: "#64748b", marginTop: 8, textAlign: "center" }}>
    {children}
  </div>
);