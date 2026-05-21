export default function App() {
  const pageRef = useRef();

  return (
    <div style={pageWrapper}>
      <div style={container} ref={pageRef}>

        {/* 헤더 */}
        <header style={headerStyle}>
          <h1 style={{ fontSize: "28px", margin: 0 }}>
            출장비 신청서
          </h1>
          <p style={{ marginTop: "6px", color: "#64748b" }}>
            자동 계산 기반 정산 페이지
          </p>
        </header>

        {/* 입력 영역 */}
        <section style={sectionBox}>
          <SectionTitle>기본 정보</SectionTitle>

          <div style={grid3}>
            <Input label="신청자명" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="소속" value={form.department} onChange={(v) => setForm({ ...form, department: v })} />

            <div>
              <label>직급</label>
              <select style={inputStyle} value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}>
                <option>교수/부교수</option>
                <option>조교수/연구원/학생</option>
              </select>
            </div>

            <Input label="출장지" value={form.destination} onChange={(v) => setForm({ ...form, destination: v })} />

            <Input label="시작일" type="date" value={form.startDate}
              onChange={(v) => setForm({ ...form, startDate: v })} />

            <Input label="종료일" type="date" value={form.endDate}
              onChange={(v) => setForm({ ...form, endDate: v })} />
          </div>
        </section>

        {/* 식대 */}
        <section style={sectionBox}>
          <SectionTitle>식비 및 회의비</SectionTitle>

          <div style={grid2}>
            <SelectBox label="식대 제공" value={mealProvided} setValue={setMealProvided} />
            <SelectBox label="회의비 사용" value={meetingMeals} setValue={setMeetingMeals} />
          </div>
        </section>

        {/* 숙박 */}
        <section style={sectionBox}>
          <SectionTitle>숙박비</SectionTitle>

          <div style={grid3}>
            <select style={inputStyle}
              value={lodging.region}
              onChange={(e) => setLodging({ ...lodging, region: e.target.value })}>
              <option>서울</option>
              <option>광역시</option>
              <option>기타(제주 포함)</option>
            </select>

            <div style={infoBox}>
              기준: {typeof lodgingLimit === "number"
                ? lodgingLimit.toLocaleString() + "원"
                : lodgingLimit}
            </div>

            <Input label="실제 숙박비" type="number"
              value={lodging.amount}
              onChange={(v) => setLodging({ ...lodging, amount: v })} />
          </div>
        </section>

        {/* 교통 */}
        <section style={sectionBox}>
          <SectionTitle>교통비</SectionTitle>
          <Input label="교통비 입력" type="number" value={transport} onChange={setTransport} />
        </section>

        {/* 요약 */}
        <section style={summaryBox}>
          <SectionTitle>정산 요약</SectionTitle>

          <div style={summaryGrid}>
            <SummaryCard title="식비" value={mealAmount} />
            <SummaryCard title="일비" value={dailyAllowance} />
            <SummaryCard title="숙박비" value={lodging.amount} />
            <SummaryCard title="교통비" value={transport} />
            <SummaryCard title="총 지급액" value={total} blue />
          </div>
        </section>

        {/* 버튼 */}
        <footer style={footerStyle}>
          <button style={btn}>이미지 저장</button>
          <button style={btn}>PDF 저장</button>
        </footer>

      </div>
    </div>
  );
}
const pageWrapper = {
  background: "#f3f4f6",
  minHeight: "100vh",
  padding: "40px",
};

const container = {
  maxWidth: "900px",
  margin: "0 auto",
  background: "#fff",
  borderRadius: "20px",
  padding: "40px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const headerStyle = {
  marginBottom: "30px",
};

const sectionBox = {
  marginTop: "30px",
  paddingBottom: "20px",
  borderBottom: "1px solid #eee",
};

const summaryBox = {
  marginTop: "40px",
};

const footerStyle = {
  marginTop: "40px",
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
};

const btn = {
  padding: "12px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#2563eb",
  color: "white",
};