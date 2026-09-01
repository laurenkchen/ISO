import { useState, useRef } from 'react'
import { toPng } from 'html-to-image'
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
  const [isFinished , setIsFinished] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isBw, setIsBw] = useState(false)
  const stripRef = useRef(null);

  const downloadPhotostrip = () => {
    toPng(stripRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'photostrip.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });

    }
  const revealImages = () => {
    setIsRevealed(true);
  }
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const countdown = async () =>{
    setIsFinished(false);
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
    setIsFinished(true);
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
          <div className="w-[600px] flex flex-col items-center justify-center mt-9">
          {isFinished ? (
            isRevealed ? (
              <div className = "flex">
                <div ref = {stripRef} className="flex flex-col">
                <div className="flex flex-col gap-4  p-4 mt-9 bg-[#F4EFE5] shadow-2xl rounded-sm">
                  {capturedImages.map((img, index) => (
                    <img key={index} src={img} alt={`Captured ${index}`} className="w-[200px] h-auto object-cover" />
                  ))}
                  <div className="text-center text-xs tracking-widest text-black/60 font-mono mt-1">
                  ISO PHOTOBOOTH
                </div>
                </div>
                </div>
              
              
                <button
                    onClick={downloadPhotostrip} 
                    className="ml-5 h-12 transition-transform duration-300 ease-in-out hover:scale-110 text-[#F4EFE5] text-2xl outline outline-2 p-2 px-9 rounded-xl mt-6"
                >
                    download  </button>
              </div>
              

            ) : (
              <button onClick = {revealImages} className = "transition-transform duration-300 ease-in-out hover:scale-110 text-[#F4EFE5] text-2xl outline outline-2 p-2 px-9 rounded-xl">ready for the reveal?</button>
            )

          ) : (
            <div className="flex flex-col items-center justify-center mt-9">
              <div className="relative">
                <Webcam audio={false} ref={webcamRef} mirrored={true} screenshotFormat="image/jpeg" className={`w-[600px] h-[400px] object-cover m-2 ${isBw ? 'grayscale' : ''}`} />
                {countdownText && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-6xl font-bold rounded">
                  {countdownText}
                </div>
              )}
              </div>
              <div className = "mt-9 grid grid-cols-3 items-center w-[600px] mt-4">
                <div></div>
                <div className = "flex justify-center">
                  <button onClick={countdown} className="transition-transform duration-300 ease-in-out hover:scale-110 text-[#F4EFE5] text-2xl outline outline-2 p-2 px-9 rounded-xl ">begin</button>
                </div>
                <div className = "flex  gap-4">
                  <button onClick={() => setIsBw(!isBw)} className="transition-transform duration-300 ease-in-out hover:scale-120 w-8 h-8 rotate-45 rounded-full bg-[linear-gradient(to_right,black_50%,white_50%)]"></button>
                </div>
              </div>
            </div>

            )}
            </div>
              
          
        </div>
      </div>
    </>
  )
}
export default App
