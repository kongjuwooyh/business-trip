import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function App() {
  const pageRef = useRef();

  const [form, setForm] = useState({
    name: "",
    department: "",
    position: "조교수/연구원/학생",
    startDate: "",
    endDate: "",
    destination: "",
    type: "국내",
  });

  const [mealProvided, setMealProvided] = useState(0);
  const [meetingMeals, setMeetingMeals] = useState(0);

  const [lodging, setLodging] = useState({
    amount: 0,
  });

  const [transport, setTransport] = useState({
    type: "자동차",
    toll: 0,
    parking: 0,
    fuel: "휘발유",
    train: 0,
    bus: 0,
    etc: 0,
    air: 0,
  });

  const mealUnit = 25000;
  const dailyAllowance = 25000;

  const isProfessor = form.position === "교수/부교수";

  const days =
    form.startDate && form.endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(form.endDate) - new Date(form.startDate)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const mealAmount = days * mealUnit;
  const dailyAmount = days * dailyAllowance;

  const transportTotal =
    form.type === "해외"
      ? Number(transport.air)
      : transport.type === "자동차"
      ? Number(transport.toll) +
        Number(transport.parking) +
        Number(transport.train) +
        Number(transport.bus) +
        Number(transport.etc)
      : transport.type === "기차"
      ? Number(transport.train)
      : transport.type === "버스"
      ? Number(transport.bus)
      : transport.type === "항공"
      ? Number(transport.air)
      : Number(transport.etc);

  const total =
    mealAmount + dailyAmount + Number(lodging.amount) + transportTotal;

  const saveImage = async () => {
    const canvas = await html2canvas(pageRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.download = "출장비신청서.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const savePDF = async () => {
    const canvas = await html2canvas(pageRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("출장비신청서.pdf");
  };

  return (
    <div style={bg}>
      <div ref={pageRef} style={container}>
        <Header />

        {/* 기본정보 */}
        <Section title="기본 정보">
          <div style={grid}>
            <Input label="이름" value={form.name}
              onChange={(v) => setForm({ ...form, name: v })} />

            <Input label="소속" value={form.department}
              onChange={(v) => setForm({ ...form, department: v })} />

            <Select label="출장구분" value={form.type}
              options={["국내", "해외"]}
              onChange={(v) => setForm({ ...form, type: v })} />

            <Select label="직급" value={form.position}
              options={["교수/부교수", "조교수/연구원/학생"]}
              onChange={(v) => setForm({ ...form, position: v })} />

            <Input label="출장지" value={form.destination}
              onChange={(v) => setForm({ ...form, destination: v })} />

            <Input type="date" label="시작일"
              value={form.startDate}
              onChange={(v) => setForm({ ...form, startDate: v })} />

            <Input type="date" label="종료일"
              value={form.endDate}
              onChange={(v) => setForm({ ...form, endDate: v })} />
          </div>
        </Section>

        {/* 식비 */}
        <Section title="식비 / 일비">
          <div style={grid}>
            <div>출장일수: {days}일</div>
            <div>식비: {mealAmount.toLocaleString()}원</div>
            <div>일비: {dailyAmount.toLocaleString()}원</div>
          </div>
        </Section>

        {/* 숙박 */}
        <Section title="숙박비">
          <Input
            label="숙박비"
            type="number"
            value={lodging.amount}
            onChange={(v) =>
              setLodging({ ...lodging, amount: v })
            }
          />
        </Section>

        {/* 교통 */}
        <Section title="교통비">

          <Select
            label="교통수단"
            value={transport.type}
            options={["자동차", "기차", "버스", "항공", "기타"]}
            onChange={(v) =>
              setTransport({ ...transport, type: v })
            }
          />

          {/* 자동차 */}
          {transport.type === "자동차" && (
            <>
              <Input label="주차비"
                type="number"
                value={transport.parking}
                onChange={(v) =>
                  setTransport({ ...transport, parking: v })
                } />

              <Input label="톨게이트"
                type="number"
                value={transport.toll}
                onChange={(v) =>
                  setTransport({ ...transport, toll: v })
                } />

              <Select
                label="유종"
                value={transport.fuel}
                options={["휘발유", "경유", "LPG", "전기차", "하이브리드"]}
                onChange={(v) =>
                  setTransport({ ...transport, fuel: v })
                }
              />
            </>
          )}

          {/* 기차 */}
          {transport.type === "기차" && (
            <Input label="기차비"
              type="number"
              value={transport.train}
              onChange={(v) =>
                setTransport({ ...transport, train: v })
              } />
          )}

          {/* 버스 */}
          {transport.type === "버스" && (
            <Input label="버스비"
              type="number"
              value={transport.bus}
              onChange={(v) =>
                setTransport({ ...transport, bus: v })
              } />
          )}

          {/* 항공 */}
          {transport.type === "항공" && (
            <Input label="항공비"
              type="number"
              value={transport.air}
              onChange={(v) =>
                setTransport({ ...transport, air: v })
              } />
          )}

          {/* 기타 */}
          {transport.type === "기타" && (
            <Input label="기타 교통비"
              type="number"
              value={transport.etc}
              onChange={(v) =>
                setTransport({ ...transport, etc: v })
              } />
          )}

        </Section>

        {/* 정산 */}
        <Section title="정산 요약">
          <div style={summary}>
            <Card title="식비" value={mealAmount} />
            <Card title="일비" value={dailyAmount} />
            <Card title="숙박" value={lodging.amount} />
            <Card title="교통" value={transportTotal} />
            <Card title="총액" value={total} highlight />
          </div>
        </Section>

        <div style={btnWrap}>
          <button style={btn} onClick={saveImage}>이미지 저장</button>
          <button style={btn} onClick={savePDF}>PDF 저장</button>
        </div>
      </div>
    </div>
  );
}

/* ================= UI ================= */

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
      <h3 style={titleStyle}>{title}</h3>
      <div style={box}>{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div style={field}>
      <label>{label}</label>
      <input type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        style={input} />
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div style={field}>
      <label>{label}</label>
      <select value={value}
        onChange={(e) => onChange(e.target.value)}
        style={input}>
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
      padding: 14,
      borderRadius: 12,
      background: highlight ? "#dbeafe" : "#f8fafc"
    }}>
      <div>{title}</div>
      <div style={{ fontWeight: "bold" }}>
        {Number(value).toLocaleString()}원
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const bg = { background: "#f1f5f9", minHeight: "100vh", padding: 20 };

const container = { maxWidth: 900, margin: "0 auto", background: "#fff", padding: 20, borderRadius: 12 };

const header = { fontSize: 22, fontWeight: "bold", marginBottom: 20 };

const section = { marginTop: 20 };

const titleStyle = { fontSize: 18, color: "#1e3a8a" };

const box = { padding: 12, border: "1px solid #ddd", borderRadius: 10 };

const grid = { display: "grid", gap: 10 };

const field = { marginBottom: 10 };

const input = { width: "100%", padding: 8 };

const summary = { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 };

const btnWrap = { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 };

const btn = { padding: 10, background: "#2563eb", color: "#fff", border: "none", borderRadius: 6 };