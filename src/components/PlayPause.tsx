// import React from 'react';

// interface VolumeRangeProps {
//   setGlobalVolume: (volume: number) => void;
//   paly: HTMLAudioElement | null;
//   setPlay: (audio: HTMLAudioElement | null) => void;
//   globalVolume: number;
// }

// function VolumeRange({
//   setGlobalVolume,
//   currentAudio,
//   globalVolume,
// }: VolumeRangeProps) {

//   const handleVolumeChange = (volume: number) => {
//     setGlobalVolume(volume);

//     if (currentAudio && play) {
//       currentAudio.play 
//     }

//     const audioElements = document.querySelectorAll<HTMLAudioElement>("audio");
//     audioElements.forEach((audio) => {
//       audio.volume = volume;
//     });
//   };

//   return (
//    <div className='h-3 w-80  flex  flex-col gap-2  items-start sm:items-end text-slate-200'>
//     <label className='lg:text-xl text-lg sm:text-center w-full sm:pl-10' htmlFor="volume">Volume</label>
//      <input
//       type="range"
//       min="0"
//       max="1"
//       step="0.1"
//       id='volume'
//       value={globalVolume}
//       onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
//       className="w-1/2 cursor-pointer"
//     />
//    </div>
//   );
// }

// export default VolumeRange;
