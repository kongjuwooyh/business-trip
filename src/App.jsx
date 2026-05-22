import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const ref = useRef();

  /* ================= FORM ================= */
  const [form, setForm] = useState({
    name: "",
    dept: "",
    position: "조교수/연구원/학생",
    type: "국내",
    transport: "자동차",
    start: "",
    end: "",
  });

  /* ================= COST ================= */
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

  /* ================= DAYS ================= */
  let days = 0;
  if (form.start && form.end) {
    const diff =
      new Date(form.end) - new Date(form.start);
    days =
      Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    if (days < 1) days = 1;
  }

  const isOneDay = days === 1;
  const isProfessor =
    form.position === "교수/부교수";

  /* ================= CALC ================= */
  const meal = days * 25000;
  const daily = days * 25000;

  const lodging =
    isOneDay
      ? 0
      : isProfessor
      ? Number(cost.lodging || 0)
      : Number(cost.lodging || 0);

  let transport = 0;

  if (form.transport === "자동차") {
    transport =
      Number(cost.toll || 0) +
      Number(cost.parking || 0);
  } else if (form.transport === "항공") {
    transport =
      Number(cost.air || 0) +
      Number(cost.airParking || 0);
  } else if (form.transport === "기차") {
    transport = Number(cost.train || 0);
  } else if (form.transport === "버스") {
    transport = Number(cost.bus || 0);
  } else {
    transport = Number(cost.etc || 0);
  }

  const total = meal + daily + lodging + transport;

  /* ================= SAVE ================= */
  const saveImage = async () => {
    const canvas = await html2canvas(ref.current, {
      scale: 2,
    });

    const a = document.createElement("a");
    a.download = "출장비.png";
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
    pdf.save("출장비.pdf");
  };

  /* ================= UI ================= */
  return (
    <div style={bg}>
      <div style={wrap} ref={ref}>
        <Header />

        {/* 기본정보 */}
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
              options={[
                "교수/부교수",
                "조교수/연구원/학생",
              ]}
              onChange={(v) =>
                setForm({
                  ...form,
                  position: v,
                })
              }
            />
            <Select
              label="출장구분"
              value={form.type}
              options={["국내", "해외"]}
              onChange={(v) =>
                setForm({ ...form, type: v })
              }
            />
            <Select
              label="교통수단"
              value={form.transport}
              options={[
                "자동차",
                "항공",
                "기차",
                "버스",
                "기타",
              ]}
              onChange={(v) =>
                setForm({
                  ...form,
                  transport: v,
                })
              }
            />
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

        {/* 식비 */}
        <Section title="식비 / 일비">
          <SummaryRow>
            <Card title="식비" value={meal} />
            <Card title="일비" value={daily} />
          </SummaryRow>
        </Section>

        {/* 숙박 */}
        <Section title="숙박비">
          <Grid>
            <Input
              label={
                isProfessor
                  ? "숙박비(실비)"
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
            교수: 실비 / 서울 10만 / 광역시 8만 / 기타 7만
          </Info>
        </Section>

        {/* 교통 */}
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

        {/* 정산 */}
        <Section title="정산 요약">
          <SummaryRow>
            <Card title="식비" value={meal} />
            <Card title="일비" value={daily} />
            <Card title="숙박" value={lodging} />
            <Card title="교통" value={transport} />
            <Card title="총액" value={total} highlight />
          </SummaryRow>
        </Section>

        {/* 버튼 */}
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

/* ================= COMPONENTS ================= */

function Header() {
  return (
    <div style={header}>
      출장비 자동 정산 시스템
    </div>
  );
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
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={input}
      />
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div style={field}>
      <label>{label}</label>
      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
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
      <div>{Number(value || 0).toLocaleString()}원</div>
    </div>
  );
}

function SummaryRow({ children }) {
  return <div style={summary}>{children}</div>;
}

function Info({ children }) {
  return <div style={info}>{children}</div>;
}

/* ================= STYLE ================= */

const bg = {
  background: "#f1f5f9",
  minHeight: "100vh",
  padding: 20,
};

const wrap = {
  maxWidth: 900,
  margin: "auto",
  background: "#fff",
  padding: 20,
  borderRadius: 12,
};

const header = {
  textAlign: "center",
  fontSize: 22,
  fontWeight: "bold",
};

const section = { marginTop: 20 };

const sectionTitle = {
  fontSize: 18,
  fontWeight: "bold",
  color: "#1e3a8a",
};

const box = {
  border: "1px solid #ddd",
  padding: 12,
  borderRadius: 10,
};

const field = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const input = {
  width: 160,
  padding: 8,
  textAlign: "center",
};

const summary = {
  display: "flex",
  flexWrap: "nowrap",
  overflowX: "auto",
  gap: 10,
};

const btnWrap = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 10,
  marginTop: 20,
};

const btn = {
  padding: 10,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
};

const info = {
  fontSize: 12,
  textAlign: "center",
  color: "#64748b",
};