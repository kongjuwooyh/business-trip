import React, { useState, useRef } from "react";
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
    transportType: "자동차",
  });

  const [lodging, setLodging] = useState({
    amount: 0,
  });

  const [transport, setTransport] = useState({
    toll: 0,
    parking: 0,
    fuel: "휘발유",
    train: 0,
    bus: 0,
    etc: 0,
    air: 0,
    airParking: 0,
  });

  const mealUnit = 25000;
  const dailyUnit = 25000;

  // ✔ 출장일수 계산
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

  // ✔ 식비 / 일비
  const meal = days * mealUnit;
  const daily = days * dailyUnit;

  // ✔ 교통비 계산
  const transportTotal = (() => {
    if (form.type === "해외") {
      return Number(transport.air) + Number(transport.airParking);
    }

    switch (form.transportType) {
      case "자동차":
        return (
          Number(transport.toll) +
          Number(transport.parking)
        );
      case "기차":
        return Number(transport.train);
      case "버스":
        return Number(transport.bus);
      case "항공":
        return Number(transport.air);
      default:
        return Number(transport.etc);
    }
  })();

  const total =
    meal + daily + Number(lodging.amount) + transportTotal;

  const saveImage = async () => {
    const canvas = await html2canvas(pageRef.current, {
      scale: 2,
      useCORS: true,
    });

    const link = document.createElement("a");
    link.download = "출장비신청서.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const savePDF = async () => {
    const canvas = await html2canvas(pageRef.current, {
      scale: 2,
      useCORS: true,
    });

    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save("출장비신청서.pdf");
  };

  return (
    <div style={bg}>
      <div ref={pageRef} style={container}>
        <Header />

        {/* 기본정보 */}
        <Section title="기본 정보">
          <div style={grid}>
            <Input label="이름" />
            <Input label="소속" />
            <Select label="출장구분" options={["국내", "해외"]} />
            <Select
              label="교통수단"
              options={["자동차", "기차", "버스", "항공", "기타"]}
              onChange={(v) =>
                setForm({ ...form, transportType: v })
              }
            />
            <Input label="출장지" />
            <Input type="date" label="시작일" />
            <Input type="date" label="종료일" />
          </div>
        </Section>

        {/* 식비 */}
        <Section title="식비 / 일비">
          <div style={grid}>
            <div>출장일수: {days}일</div>
            <div>식비: {meal.toLocaleString()}원</div>
            <div>일비: {daily.toLocaleString()}원</div>
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

          {form.type === "국내" && (
            <>
              {form.transportType === "자동차" && (
                <>
                  <Input label="톨게이트"
                    type="number"
                    value={transport.toll}
                    onChange={(v) =>
                      setTransport({ ...transport, toll: v })
                    } />

                  <Input label="주차비"
                    type="number"
                    value={transport.parking}
                    onChange={(v) =>
                      setTransport({ ...transport, parking: v })
                    } />

                  <Select label="유종"
                    options={["휘발유", "경유", "LPG", "전기차", "하이브리드"]} />
                </>
              )}

              {form.transportType === "기차" && (
                <Input label="기차비"
                  type="number"
                  value={transport.train}
                  onChange={(v) =>
                    setTransport({ ...transport, train: v })
                  } />
              )}

              {form.transportType === "버스" && (
                <Input label="버스비"
                  type="number"
                  value={transport.bus}
                  onChange={(v) =>
                    setTransport({ ...transport, bus: v })
                  } />
              )}

              {form.transportType === "항공" && (
                <>
                  <Input label="항공비"
                    type="number"
                    value={transport.air}
                    onChange={(v) =>
                      setTransport({ ...transport, air: v })
                    } />

                  <Input label="항공 주차비"
                    type="number"
                    value={transport.airParking}
                    onChange={(v) =>
                      setTransport({ ...transport, airParking: v })
                    } />
                </>
              )}

              {form.transportType === "기타" && (
                <Input label="기타 교통비"
                  type="number"
                  value={transport.etc}
                  onChange={(v) =>
                    setTransport({ ...transport, etc: v })
                  } />
              )}
            </>
          )}

          {form.type === "해외" && (
            <>
              <Input label="항공비"
                type="number"
                value={transport.air}
                onChange={(v) =>
                  setTransport({ ...transport, air: v })
                } />

              <Input label="항공 주차비"
                type="number"
                value={transport.airParking}
                onChange={(v) =>
                  setTransport({ ...transport, airParking: v })
                } />
            </>
          )}
        </Section>

        {/* 정산 */}
        <Section title="정산 요약">
          <div style={summary}>
            <Card title="식비" value={meal} />
            <Card title="일비" value={daily} />
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
  return <div style={header}>출장비 자동 정산 시스템</div>;
}

function Section({ title, children }) {
  return (
    <div style={section}>
      <h3 style={titleStyle}>{title}</h3>
      <div style={box}>{children}</div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <div style={field}>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={input}
      />
    </div>
  );
}

function Select({ label, options, onChange }) {
  return (
    <div style={field}>
      <label>{label}</label>
      <select
        style={input}
        onChange={(e) => onChange?.(e.target.value)}
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
      background: highlight ? "#dbeafe" : "#f8fafc"
    }}>
      <div>{title}</div>
      <div>{Number(value).toLocaleString()}원</div>
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