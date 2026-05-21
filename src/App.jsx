import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function BusinessTripExpensePage() {
  const pageRef = React.useRef(null);
  const [tripInfo, setTripInfo] = React.useState({
    startDate: "2026-05-20",
    endDate: "2026-05-22",
  });

  const [form, setForm] = React.useState({
    name: "",
    department: "",
    position: "조교수/연구원/학생",
    destination: "",
    purpose: "",
  });

  const createDateRange = (start, end) => {
    if (!start || !end) return [];

    const result = [];
    const current = new Date(start);
    const last = new Date(end);

    while (current <= last) {
      result.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }

    return result;
  };

  const dates = createDateRange(
    tripInfo.startDate,
    tripInfo.endDate
  );

  const [providedMeals, setProvidedMeals] = React.useState([]);
  const [meetingMeals, setMeetingMeals] = React.useState([]);

  React.useEffect(() => {
    setProvidedMeals((prev) =>
      dates.map((_, index) => prev[index] || 0)
    );

    setMeetingMeals((prev) =>
      dates.map((_, index) => prev[index] || 0)
    );
  }, [tripInfo.startDate, tripInfo.endDate]);

  const handleProvidedMeal = (index, value) => {
    const updated = [...providedMeals];
    updated[index] = Number(value);
    setProvidedMeals(updated);
  };

  const handleMeetingMeal = (index, value) => {
    const updated = [...meetingMeals];
    updated[index] = Number(value);
    setMeetingMeals(updated);
  };

  const totalMeals = dates.length * 3;

  const totalProvidedMeals = providedMeals.reduce(
    (sum, count) => sum + Number(count),
    0
  );

  const totalMeetingMeals = meetingMeals.reduce(
    (sum, count) => sum + Number(count),
    0
  );

  const payableMeals = Math.max(
    totalMeals - totalProvidedMeals - totalMeetingMeals,
    0
  );

  const mealAllowance = 25000;
  const dailyAllowance = 20000;
  const lodgingAllowance = 70000;

  const mealAmount = payableMeals * (mealAllowance / 3);

  const tripDays = dates.length;

  const dailyAmount = tripDays * dailyAllowance;

  const lodgingNights = Math.max(tripDays - 1, 0);
  const lodgingAmount = lodgingNights * lodgingAllowance;

  const [transportAmount, setTransportAmount] = React.useState(0);

  const [lodgingInfo, setLodgingInfo] = React.useState({
    amount: 0,
    region: "서울",
    sharedRoom: false,
    peopleCount: 2,
  });

  const lodgingStandards = {
    교수부교수: {
      서울: "실비 지급",
      광역시: "실비 지급",
      기타: "실비 지급",
    },
    일반: {
      서울: 100000,
      광역시: 80000,
      기타: 70000,
    },
  };

  const isProfessor =
    form.position === "교수/부교수";

  const selectedLodgingStandard = isProfessor
    ? "실비 지급"
    : lodgingStandards.일반[lodgingInfo.region] || 0;

  const finalLodgingAmount = Number(
    lodgingInfo.amount || 0
  );

  const totalAmount =
    mealAmount +
    dailyAmount +
    finalLodgingAmount +
    Number(transportAmount);

  const handleSaveImage = async () => {
    const canvas = await html2canvas(pageRef.current);

    const link = document.createElement("a");
    link.download = "출장비신청서.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleSavePDF = async () => {
    const canvas = await html2canvas(pageRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("출장비신청서.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div
        ref={pageRef}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            출장비 지급 신청
          </h1>
          <p className="text-slate-500 mt-2">
            출장 기간과 식대 제공 정보를 입력해주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              출장 시작일
            </label>
            <input
              type="date"
              value={tripInfo.startDate}
              onChange={(e) =>
                setTripInfo({
                  ...tripInfo,
                  startDate: e.target.value,
                })
              }
              className="w-full border rounded-2xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              출장 종료일
            </label>
            <input
              type="date"
              value={tripInfo.endDate}
              onChange={(e) =>
                setTripInfo({
                  ...tripInfo,
                  endDate: e.target.value,
                })
              }
              className="w-full border rounded-2xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              신청자명
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full border rounded-2xl px-4 py-3"
              placeholder="홍길동"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              소속
            </label>
            <input
              type="text"
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
              className="w-full border rounded-2xl px-4 py-3"
              placeholder="SW중심대학사업단"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              직급
            </label>

            <select
              value={form.position}
              onChange={(e) =>
                setForm({ ...form, position: e.target.value })
              }
              className="w-full border rounded-2xl px-4 py-3"
            >
              <option value="교수/부교수">교수/부교수</option>
              <option value="조교수/연구원/학생">
                조교수/연구원/학생
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">출장지
            </label>
            <input
              type="text"
              value={form.destination}
              onChange={(e) =>
                setForm({ ...form, destination: e.target.value })
              }
              className="w-full border rounded-2xl px-4 py-3"
              placeholder="서울"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              출장 목적
            </label>
            <input
              type="text"
              value={form.purpose}
              onChange={(e) =>
                setForm({ ...form, purpose: e.target.value })
              }
              className="w-full border rounded-2xl px-4 py-3"
              placeholder="학회 참석"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-1">
            식대 및 회의비 입력
          </h2>

          <p className="text-sm text-slate-500 mb-4">
            제공받았거나 숙박비에 포함된 식사는 식대 제공 횟수에 입력해주세요.
          </p>

          <div className="overflow-x-auto border rounded-2xl">
            <table className="w-full text-center border-collapse">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4">날짜</th>
                  <th className="p-4">
                    식대 제공 횟수
                    <br />
                    <span className="text-xs text-slate-400">
                      (제공·숙박 포함)
                    </span>
                  </th>
                  <th className="p-4">회의비 사용 횟수</th>
                </tr>
              </thead>

              <tbody>
                {dates.map((date, index) => (
                  <tr key={date} className="border-t">
                    <td className="p-4 font-medium">{date}</td>

                    <td className="p-2">
                      <select
                        value={providedMeals[index] || 0}
                        onChange={(e) =>
                          handleProvidedMeal(index, e.target.value)
                        }
                        className="border rounded-xl px-3 py-2"
                      >
                        <option value={0}>0식</option>
                        <option value={1}>1식</option>
                        <option value={2}>2식</option>
                        <option value={3}>3식</option>
                      </select>
                    </td>

                    <td className="p-2">
                      <select
                        value={meetingMeals[index] || 0}
                        onChange={(e) =>
                          handleMeetingMeal(index, e.target.value)
                        }
                        className="border rounded-xl px-3 py-2"
                      >
                        <option value={0}>0회</option>
                        <option value={1}>1회</option>
                        <option value={2}>2회</option>
                        <option value={3}>3회</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">
            숙박비 입력
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                지역 구분
              </label>

              <select
                value={lodgingInfo.region}
                onChange={(e) =>
                  setLodgingInfo({
                    ...lodgingInfo,
                    region: e.target.value,
                  })
                }
                className="w-full border rounded-2xl px-4 py-3"
              >
                <option value="서울">서울</option>
                <option value="광역시">광역시</option>
                <option value="기타">기타(제주 포함)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                지역 기준 금액
              </label>

              <div className="w-full border rounded-2xl px-4 py-3 bg-slate-100 text-slate-700">
                {typeof selectedLodgingStandard === "number"
                  ? `${selectedLodgingStandard.toLocaleString()}원`
                  : selectedLodgingStandard}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                실제 숙박비 입력
              </label>

              <input
                type="number"
                value={lodgingInfo.amount}
                onChange={(e) =>
                  setLodgingInfo({
                    ...lodgingInfo,
                    amount: e.target.value,
                  })
                }
                className="w-full border rounded-2xl px-4 py-3"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={lodgingInfo.sharedRoom}
                onChange={(e) =>
                  setLodgingInfo({
                    ...lodgingInfo,
                    sharedRoom: e.target.checked,
                  })
                }
                className="w-5 h-5"
              />
              2인 이상 숙박 여부
            </label>

            {lodgingInfo.sharedRoom && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  숙박 인원 수
                </label>

                <input
                  type="number"
                  min={2}
                  value={lodgingInfo.peopleCount}
                  onChange={(e) =>
                    setLodgingInfo({
                      ...lodgingInfo,
                      peopleCount: e.target.value,
                    })
                  }
                  className="border rounded-2xl px-4 py-3 w-40"
                />
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">
              교통비 입력
            </h3>

            <div className="max-w-sm">
              <label className="block text-sm font-medium mb-2">
                교통비 금액
              </label>

              <input
                type="number"
                value={transportAmount}
                onChange={(e) => setTransportAmount(e.target.value)}
                className="w-full border rounded-2xl px-4 py-3"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-slate-50 rounded-2xl p-5 shadow-sm">
            <div className="text-sm text-slate-500">전체 식수</div>
            <div className="text-2xl font-bold mt-2">
              {totalMeals}식
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 shadow-sm">
            <div className="text-sm text-slate-500">
              제공·포함 식사
            </div>
            <div className="text-2xl font-bold mt-2">
              {totalProvidedMeals}식
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 shadow-sm">
            <div className="text-sm text-slate-500">
              회의비 사용 식수
            </div>
            <div className="text-2xl font-bold mt-2">
              {totalMeetingMeals}회
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 shadow-sm">
            <div className="text-sm text-slate-500">숙박비</div>
            <div className="text-2xl font-bold mt-2">
              {finalLodgingAmount.toLocaleString()}원
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-5 shadow-sm border border-blue-200">
            <div className="text-sm text-blue-600">
              최종 지급 예정액
            </div>
            <div className="text-2xl font-bold mt-2 text-blue-700">
              {Math.round(totalAmount).toLocaleString()}원
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={handleSaveImage}
              className="px-5 py-3 rounded-2xl border hover:bg-slate-100 transition"
            >
              이미지 저장
            </button>

            <button
              onClick={handleSavePDF}
              className="px-5 py-3 rounded-2xl border hover:bg-slate-100 transition"
            >
              PDF 저장
            </button>
          </div>

          <div className="text-sm text-slate-500 text-right">
            저장한 이미지 또는 PDF 파일을 사업단 담당자에게 제출해주세요.
          </div>
        </div>
      </div>
    </div>
  );
}
