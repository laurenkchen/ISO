import { useState, useRef, useEffect } from 'react'
import { toPng } from 'html-to-image'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import gifshot from 'gifshot'
import './App.css'
import Webcam from "react-webcam";
function AnimatedPhoto({frames, className, isBw}){
    const [currentFrame, setCurrentFrame] = useState(0);
    useEffect(() => {
      if(!Array.isArray(frames) || frames.length === 0) return;
      const interval = setInterval(() => {
        setCurrentFrame((prevFrame) => (prevFrame + 1) % frames.length);
      }, 100); 
      return () => clearInterval(interval);
    }, [frames]);
    const imageSrc = Array.isArray(frames) ? frames[currentFrame] : frames;
    return (
      <img src={imageSrc} className={`${className} ${isBw ? 'grayscale' : ''}`}/>

    )
  }
function App() {
  const [count, setCount] = useState(0)
  const webcamRef = useRef(null);
  const [countdownText, setCountdownText] = useState("");
  const [capturedImages, setCapturedImages] = useState([]);
  const [isFinished , setIsFinished] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isBw, setIsBw] = useState(false)
  const stripRef = useRef(null);

  const downloadPhotostrip = async () => {
    const numFrames = capturedImages[0]?.length || 0;
    if (numFrames === 0) return;
    const scale = 2;
    const padding = 16 * scale;
    const imgWidth = 208 * scale;
    const gap = 16 * scale; 
    const textSpace = 40 * scale; 

    const sampleImg = await new Promise((resolve) => {
      const img = new Image();
      img.src = capturedImages[0][0];
      img.onload = () => resolve(img);
    });

    const naturalRatio = sampleImg.naturalHeight / sampleImg.naturalWidth;
    const imgHeight = imgWidth * naturalRatio;

    const canvas = document.createElement('canvas');
    canvas.width = 240 * scale; 
    
    const numPhotos = capturedImages.length;
    const photosTotalHeight = (numPhotos * imgHeight) + ((numPhotos - 1) * gap);
    canvas.height = padding + photosTotalHeight + textSpace + padding;

    const ctx = canvas.getContext('2d');
    const generatedFrames = [];

    for (let f = 0; f < numFrames; f++) {
      ctx.fillStyle = '#F4EFE5';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      let yOffset = padding;
      for (let i = 0; i < numPhotos; i++) {
        const frameSrc = capturedImages[i][f] || capturedImages[i][0];
        await new Promise((resolve) => {
          const img = new Image();
          img.src = frameSrc;
          img.onload = () => {
            ctx.drawImage(img, padding, yOffset, imgWidth, imgHeight);
            resolve();
          };
        });
        yOffset += imgHeight + gap; 
      }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.font = `${10 * scale}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText('ISO PHOTOBOOTH', canvas.width / 2, yOffset + (textSpace / 2) - (4 * scale));

      generatedFrames.push(canvas.toDataURL('image/png'));
    }

    gifshot.createGIF(
      {
        images: generatedFrames,
        interval: 0.1,
        gifWidth: canvas.width,
        gifHeight: canvas.height,
      },
      (obj) => {
        if (!obj.error) {
          const link = document.createElement('a');
          link.download = 'photostrip.gif';
          link.href = obj.image;
          link.click();
        } else {
          console.error("GIF error:", obj.errorMsg);
        }
      }
    );
  };
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
      const capturedFrames = await capture();
      setCapturedImages((prev) => [...prev, capturedFrames]);
      setCountdownText("");
    }
    setIsFinished(true);
  }
  const capture = async () => {
    const frames = [];
    const totalFrames = 20;
    const intervalTime = 100;
    for(let i=0; i<totalFrames; i++){
      if(webcamRef.current){
        const imageSrc = webcamRef.current.getScreenshot();
        frames.push(imageSrc);
      }
      await delay(intervalTime);
    }
    return frames
  };
  return (
    <>
      <link rel="icon" href={"public/si.png"} />
      <title>ISO Photobooth</title>
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
          <div className="w-[600px] flex flex-col items-center justify-center mt-6">
          {isFinished ? (
            isRevealed ? (
              <div className = "flex flex-col">
                <button
                    onClick={downloadPhotostrip} 
                    className=" mb-3 h-12 transition-transform duration-300 ease-in-out hover:scale-110 text-[#F4EFE5] text-2xl outline outline-2 p-2 px-9 rounded-xl "
                >
                    download  </button>
                <div ref = {stripRef} className="flex flex-col bg-[#F4EFE5] shadow-2xl border-2  border-[#F4EFE5] rounded-sm">
                <div className="flex flex-col gap-4  p-4  bg-[#F4EFE5] shadow-2xl rounded-sm">
                  {capturedImages.map((img, index) => (
                    <AnimatedPhoto key={index} frames={img} className="w-[200px] h-auto object-cover" isBw={isBw} />
                  ))}
                  <div className="text-center text-xs tracking-widest text-black/60 font-mono mt-1">
                  ISO PHOTOBOOTH
                </div>
                </div>
                </div>
              </div>
            ) : (
              <button onClick = {revealImages} className = "transition-transform duration-300 ease-in-out hover:scale-110 text-[#F4EFE5] text-2xl outline outline-2 p-2 px-9 rounded-xl">ready for the reveal?</button>
            )
          ) : (
            <div className="flex flex-col items-center justify-center mt-9">
              <div className="relative">
                <Webcam audio={false} ref={webcamRef} mirrored={true} screenshotFormat="image/jpeg" className={`w-[600px] h-[400px] object-cover${isBw ? 'grayscale' : ''}`} />
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
                <div className = "flex gap-4">
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