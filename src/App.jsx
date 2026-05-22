import React, { useState, useRef, useMemo } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const ref = useRef();

  const [form, setForm] = useState({
    name: "",
    dept: "",
    position: "조교수/연구원/학생",
    tripType: "국내",
    transport: "자동차",
    start: "",
    end: "",
  });

  const [cost, setCost] = useState({
    lodging: 0,

    carToll: 0,
    carParking: 0,

    airFare: 0,
    airParking: 0,

    train: 0,
    bus: 0,
    etc: 0,
  });

  /* ================= 날짜 ================= */
  const days = useMemo(() => {
    if (!form.start || !form.end) return 0;
    const diff = new Date(form.end) - new Date(form.start);
    const d = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    return d > 0 ? d : 0;
  }, [form.start, form.end]);

  const isOneDay = days === 1;
  const isProfessor = form.position === "교수/부교수";
  const isOverseas = form.tripType === "해외";

  /* ================= 식비 / 일비 ================= */
  const meal = days * 25000;
  const daily = days * 25000;

  /* ================= 숙박 ================= */
  const lodging = isOneDay ? 0 : Number(cost.lodging || 0);

  const lodgingStd = isProfessor
    ? "실비"
    : {
        서울: 100000,
        광역시: 80000,
        기타: 70000,
      };

  /* ================= 교통비 (핵심 수정) ================= */
  const transport = useMemo(() => {
    if (isOverseas) {
      return Number(cost.airFare || 0) + Number(cost.airParking || 0);
    }

    switch (form.transport) {
      case "자동차":
        return (
          Number(cost.carToll || 0) +
          Number(cost.carParking || 0)
        );

      case "항공":
        return (
          Number(cost.airFare || 0) +
          Number(cost.airParking || 0)
        );

      case "기차":
        return Number(cost.train || 0);

      case "버스":
        return Number(cost.bus || 0);

      default:
        return Number(cost.etc || 0);
    }
  }, [form, cost, isOverseas]);

  const total = meal + daily + lodging + transport;

  /* ================= 저장 ================= */
  const saveImage = async () => {
    const canvas = await html2canvas(ref.current, {
      scale: 2,
      useCORS: true,
    });

    const a = document.createElement("a");
    a.download = "출장비.png";
    a.href = canvas.toDataURL();
    a.click();
  };

  const savePDF = async () => {
    const canvas = await html2canvas(ref.current, {
      scale: 2,
      useCORS: true,
    });

    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const w = pdf.internal.pageSize.getWidth();
    const h = (canvas.height * w) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, w, h);
    pdf.save("출장비.pdf");
  };

  return (
    <div style={bg}>
      <div style={wrap} ref={ref}>
        <Header />

        {/* 기본정보 */}
        <Section title="기본 정보">
          <Row>
            <Input label="이름" value={form.name}
              onChange={(v) => setForm({ ...form, name: v })} />

            <Input label="소속" value={form.dept}
              onChange={(v) => setForm({ ...form, dept: v })} />

            <Select label="직급"
              value={form.position}
              options={["교수/부교수", "조교수/연구원/학생"]}
              onChange={(v) => setForm({ ...form, position: v })} />

            <Select label="출장구분"
              value={form.tripType}
              options={["국내", "해외"]}
              onChange={(v) => setForm({ ...form, tripType: v })} />

            <Select label="교통수단"
              value={form.transport}
              options={["자동차", "항공", "기차", "버스", "기타"]}
              onChange={(v) => setForm({ ...form, transport: v })} />

            <Input label="시작일"
              type="date"
              value={form.start}
              onChange={(v) => setForm({ ...form, start: v })} />

            <Input label="종료일"
              type="date"
              value={form.end}
              onChange={(v) => setForm({ ...form, end: v })} />
          </Row>
        </Section>

        {/* 식비 */}
        <Section title="식비 / 일비">
          <Row>
            <Card title="식비" value={meal} />
            <Card title="일비" value={daily} />
          </Row>
        </Section>

        {/* 숙박 */}
        <Section title="숙박비">
          <Row>
            <Input label="숙박비"
              value={cost.lodging}
              onChange={(v) => setCost({ ...cost, lodging: v })} />
          </Row>

          <Info>
            {isProfessor
              ? "교수/부교수: 실비 지급"
              : "서울 10만 / 광역시 8만 / 기타 7만"}
          </Info>
        </Section>

        {/* 교통비 */}
        <Section title="교통비">
          <Row>
            <Input label="자동차 톨게이트"
              value={cost.carToll}
              onChange={(v) => setCost({ ...cost, carToll: v })} />

            <Input label="자동차 주차비"
              value={cost.carParking}
              onChange={(v) => setCost({ ...cost, carParking: v })} />

            <Input label="항공비"
              value={cost.airFare}
              onChange={(v) => setCost({ ...cost, airFare: v })} />

            <Input label="항공 주차비"
              value={cost.airParking}
              onChange={(v) => setCost({ ...cost, airParking: v })} />

            <Input label="기차비"
              value={cost.train}
              onChange={(v) => setCost({ ...cost, train: v })} />

            <Input label="버스비"
              value={cost.bus}
              onChange={(v) => setCost({ ...cost, bus: v })} />

            <Input label="기타"
              value={cost.etc}
              onChange={(v) => setCost({ ...cost, etc: v })} />
          </Row>
        </Section>

        {/* 정산 */}
        <Section title="정산 요약">
          <Row nowrap>
            <Card title="식비" value={meal} />
            <Card title="일비" value={daily} />
            <Card title="숙박" value={lodging} />
            <Card title="교통" value={transport} />
            <Card title="총액" value={total} highlight />
          </Row>
        </Section>

        <Buttons>
          <button onClick={saveImage}>이미지 저장</button>
          <button onClick={savePDF}>PDF 저장</button>
        </Buttons>
      </div>
    </div>
  );
}

/* ================= UI ================= */

function Header() {
  return <div style={styles.header}>출장비 자동 정산 시스템</div>;
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.title}>{title}</h2>
      <div style={styles.box}>{children}</div>
    </div>
  );
}

function Row({ children, nowrap }) {
  return (
    <div style={{
      display: "flex",
      flexWrap: nowrap ? "nowrap" : "wrap",
      gap: 10,
      justifyContent: "center",
      overflowX: nowrap ? "auto" : "visible"
    }}>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type }) {
  return (
    <div style={styles.field}>
      <label>{label}</label>
      <input
        type={type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      />
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div style={styles.field}>
      <label>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
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
    <div style={{
      padding: 12,
      borderRadius: 10,
      background: highlight ? "#dbeafe" : "#f8fafc",
      minWidth: 120,
      textAlign: "center",
    }}>
      <div>{title}</div>
      <div>{Number(value || 0).toLocaleString()}원</div>
    </div>
  );
}

function Buttons({ children }) {
  return <div style={styles.btnWrap}>{children}</div>;
}

function Info({ children }) {
  return <div style={styles.info}>{children}</div>;
}

/* ================= STYLE ================= */

const bg = { background: "#f1f5f9", minHeight: "100vh", padding: 20 };
const wrap = { maxWidth: 950, margin: "auto", background: "#fff", padding: 20, borderRadius: 12 };

const styles = {
  header: { textAlign: "center", fontSize: 22, fontWeight: "bold" },
  section: { marginTop: 20 },
  title: { fontSize: 18, fontWeight: "bold", color: "#1e3a8a" },
  box: { border: "1px solid #ddd", padding: 12, borderRadius: 10 },
  field: { display: "flex", flexDirection: "column", alignItems: "center" },
  input: { width: 160, padding: 8, textAlign: "center" },
  btnWrap: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 },
  info: { fontSize: 12, textAlign: "center", color: "#64748b" }
};