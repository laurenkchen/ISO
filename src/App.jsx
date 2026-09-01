import { useState, useRef } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Webcam from "react-webcam";
function App() {
  const [count, setCount] = useState(0)
  const webcamRef = useRef(null);
  const [countdownText, setCountdownText] = useState("");
  const [capturedImages, setCapturedImages] = useState([]);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const countdown = async () =>{
    setCapturedImages([]);
    for (let i = 3; i > 0; i--) {
      for (let z = 3; z > 0; z--) {
        setCountdownText(z.toString());
        await delay(1000);
      }
      setCapturedImages((prev) => [...prev, capture()]);
      setCountdownText("");
      await delay(1000);
    }
  }
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    return(imageSrc);
  };

  return (
    <>
      <div className="flex p-6 h-screen w-full bg-[url('./assets/clouds.jpeg')]  bg-cover bg-center bg-no-repeat font-[Libre-Baskerville]">
        <div className="flex pl-6 ml-8 flex-col justify-end ">
          <p className="py-2 text-2xl text-[#F4EFE5]">laurenchen.net</p>
          <h1 className="py-2 text-9xl text-[#F4EFE5] italic">ISO</h1>
          <p className="py-2 pb-16 text-2xl text-[#F4EFE5]">A photobooth, but with gifs</p>
        </div>
        <div className="flex flex-col ml-16 mt-9 pl-9 items-center">
          
          <div className="text-center  justify-center">
            <h1 className="text-[#F4EFE5] opacity-50 text-3xl">"not all those who wander are lost"</h1>
            <h1 className="text-[#F4EFE5] opacity-50">-J.R.R. Tolkein</h1>
            
          </div>
          <div className="flex flex-col items-center justify-center mt-9">
            <div className="relative">
              <Webcam audio={false} ref={webcamRef} mirrored={true} screenshotFormat="image/jpeg" className = "w-[600px] h-[400px]  object-cover" />
              {countdownText && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-6xl font-bold rounded">
                {countdownText}
              </div>
            )}
            </div>
              <button onClick={countdown} className="text-[#F4EFE5] text-2xl outline outline-2 p-2 px-9 mt-6 rounded-xl ">begin</button>
              <button className="text-[#F4EFE5]">a</button>
              <button className="text-[#F4EFE5]">b</button>
          </div>
          <div>
            {capturedImages.map((image, index) => (
              <img key={index} src={image} alt={`Captured ${index}`} className="w-[200px] h-[150px] object-cover m-2" />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
