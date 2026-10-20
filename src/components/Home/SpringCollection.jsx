import SpringImage from "../../assets/spring.png";
import Image from "../common/Image";
import Countdown from "react-countdown";

const SpringCollection = () => {
  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <div className="mt-6.5 lg:mt-29.75 flex gap-0.5 lg:gap-6.25">
        <div className="flex gap-0.5 lg:gap-6.25  ">
          <div className="text-center">
            <h2 className="text-primary text-[18px] lg:text-[30px] font-normal leading-5.5 lg:leading-7.5">{days}</h2>
            <h3 className="text-gray  text-[18px] lg:text-[30px] font-bold leading-5.5 lg:leading-7.5">DAYS</h3>
          </div>
          <h2 className="text-primary text-[18px] lg:text-[30px] font-normal leading-7.5">:</h2>
        </div>
        <div className="flex gap-0.5 lg:gap-6.25">
          <div className="text-center">
            <h2 className="text-primary text-[18px] lg:text-[30px] font-normal leading-5.5 lg:leading-7.5">{hours}</h2>
            <h3 className="text-gray  text-[18px] lg:text-[30px] font-bold leading-5.5 lg:leading-7.5">HOURS</h3>
          </div>
          <h2 className="text-primary text-[18px] lg:text-[30px] font-normal leading-7.5">:</h2>
        </div>
        <div className="flex gap-0.5 lg:gap-6.25">
          <div className="text-center">
            <h2 className="text-primary text-[18px] lg:text-[30px] font-normal leading-5.5 lg:leading-7.5">{minutes}</h2>
            <h3 className="text-gray  text-[18px] lg:text-[30px] font-bold leading-5.5 lg:leading-7.5">MINUTES</h3>
          </div>
          <h2 className="text-primary text-[18px] lg:text-[30px] font-normal leading-7.5">:</h2>
        </div>
        <div className="flex gap-0.5 lg:gap-6.25">
          <div className="text-center">
            <h2 className="text-primary text-[18px] lg:text-[30px] font-normal leading-5.5 lg:leading-7.5">{seconds}</h2>
            <h3 className="text-gray  text-[18px] lg:text-[30px] font-bold leading-5.5 lg:leading-7.5">SECONDS</h3>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[url('./assets/mask.png')]  w-full h-full [74px] py-18.5 lg:py-7 pl-7.75">
      <div className="container">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="relative ml-15 cursor-pointer text-sm leading-6 font-medium text-[#C32929] after:absolute after:bottom-3 after:-left-14 after:h-0.5 after:w-10 after:bg-[#C32929] after:text-[#C32929] after:duration-500 after:content-['']">
              DEAL OF THE WEEK
            </h3>
            <h2 className="text-primary text-[30px] font-normal uppercase lg:text-[70px]">
              <span className="font-jost block text-[30px] font-bold lg:text-[70px]">
                Spring
              </span>{" "}
              Collection
            </h2>
            <button className="text-primary after:bg-primary relative cursor-pointer text-sm leading-6 font-medium uppercase after:absolute after:bottom-0 after:left-0 after:h-0.5 after:duration-500 after:content-[''] after:w-0 hover:after:w-full transition-all duration-300">
              Shop Now
            </button>

            <Countdown date={Date.now() + 90000000} renderer={renderer} />
          </div>
          <div>
            <Image src={SpringImage} alt="spring" className="hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpringCollection;
