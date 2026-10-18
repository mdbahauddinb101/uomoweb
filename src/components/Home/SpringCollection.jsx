import SpringImage from "../../assets/spring.png";
import Image from "../common/Image";
import Countdown from 'react-countdown';

const SpringCollection = () => {

    const renderer = ({ days, hours, minutes, seconds,}) => {
    return <div className="flex gap-6.25 mt-29.75">
 <div className="flex gap-6.25">
            <div>
              <h2 className="text-primary text-[30px] font-normal">{days}</h2>
              <h3 className="text-gray text-[16px] font-bold">DAYS</h3>
            </div>
            <h2 className="text-primary text-[30px] font-normal">:</h2>
            </div>
             <div className="flex gap-6.25">
            <div>
              <h2 className="text-primary text-[30px] font-normal">{hours}</h2>
              <h3 className="text-gray text-[16px] font-bold">HOURS</h3>
            </div>
            <h2 className="text-primary text-[30px] font-normal">:</h2>
            </div>
             <div className="flex gap-6.25">
            <div>
              <h2 className="text-primary text-[30px] font-normal">{minutes}</h2>
              <h3 className="text-gray text-[16px] font-bold">MINUTES</h3>
            </div>
            <h2 className="text-primary text-[30px] font-normal">:</h2>
            </div>
             <div className="flex gap-6.25">
            <div>
              <h2 className="text-primary text-[30px] font-normal">{seconds}</h2>
              <h3 className="text-gray text-[16px] font-bold">SECONDS</h3>
            </div>
            </div>
            </div>;
  }

  return (
    <section className="bg-[#EBEBEB] py-7">
      <div className="container">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="relative ml-15 cursor-pointer text-sm leading-6 font-medium text-[#C32929] after:absolute after:bottom-3 after:-left-14 after:h-0.5 after:w-10 after:bg-[#C32929] after:text-[#C32929] after:duration-500 after:content-['']">
              DEAL OF THE WEEK
            </h3>
            <h2 className="text-primary text-[70px] font-normal uppercase">
              {" "}
              <span className="font-bold">Spring</span> Collection
            </h2>
            <button className="text-primary after:bg-primary relative cursor-pointer text-sm leading-6 font-medium uppercase after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full">
              Shop Now
            </button>
            
           <Countdown
    date={Date.now() + 90000000}
    renderer={renderer}
  />
          </div>
          <div>
            <Image src={SpringImage} alt="spring" />
          </div>
        </div>
      </div>
    </section>
  )
}


export default SpringCollection;
