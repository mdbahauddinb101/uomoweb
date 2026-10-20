import categorydata from "../../api/categorydata.json";
import Image from "../common/Image.jsx";

const Category = () => {
  return (
    <section className="mt-0 lg:mt-25.25">
      <div className="container">
        <div className="lg:grid grid-cols-4 lg:gap-7.5">
          {categorydata.map((item) => {
            // 1. Split the dynamic name by spaces
            const nameParts = item.name ? item.name.split(" ") : [];

            // 2. Isolate the first word for the span, and join the rest back together
            const firstWord = nameParts[0] || "";
            const restOfText = nameParts.slice(1).join(" ");

            return (
              <div
                key={item.id} // Added missing key prop for React lists
                className={`relative h-full w-full ${
                  item.id === 1
                    ? "col-span-2 row-span-2"
                    : item.id === 2
                      ? "col-span-2"
                      : ""
                }`}
              >
                <Image src={item.image} alt={item.name} className={`w-full ${item.id === 2 ? "h-80.75" : "h-full"} p-3.75 lg:p-0`} />
                <div className="absolute bottom-10 left-10">
                  <h2 className="font-joist mb-1.25 text-[14px] leading-6 font-normal">
                    {item.heading2}
                  </h2>

                  {/* 3. Render the split pieces here */}
                  <h2 className="font-jost mb-1.25 text-[26px] leading-[100%] ">
                    <span className="text-primary font-bold block lg:inline pb-2 lg:pb-0">{firstWord}</span>{" "}
                    {restOfText}
                  </h2>

                  <button className="text-primary font-jost after:bg-primary cursor-pointer pb-2 text-[14px] leading-6 font-medium relative after:absolute content-[''] after:bottom-0 after:left-0 after:h-0.5 after:w-12.5">
                    {item.btn}
                  </button>
                </div>
              </div>
            );
          })}

          <div className="h-71.25 lg:w-82.5 bg-[#F5E6E0] pt-27.25 pr-17.5 pb-50 pl-10 m-3.75 lg:m-0">
            <h2 className="mb-2 font-medium font-jost text-[26px] leading-[100%]">
              <span className="font-jost font-bold text-[26px] leading-[100%] block lg:inline pb-2 lg:pb-0">E-GIFT</span> CARDS
            </h2>
            <h3 className="mb-4 font-jost font-normal text-[14px] leading-6">Surprise someone with the gift they really want.</h3>
            <button className="text-primary after:bg-primary relative text-sm leading-6 font-medium after:absolute after:top-8 after:left-0 after:h-0.5 after:w-[50%] after:duration-500 after:content-['']">DISCOVER MORE</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Category;
