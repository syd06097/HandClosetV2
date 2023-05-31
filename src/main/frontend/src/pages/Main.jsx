import React, { useEffect, useState } from "react";

const Main = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    // 위치 정보 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div>
      <h1>Main</h1>
      {latitude && longitude && (
        <p>
          Your current location: {latitude}, {longitude}
        </p>
      )}
    </div>
  );
};

export default Main;
