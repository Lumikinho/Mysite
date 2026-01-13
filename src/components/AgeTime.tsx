import React, { useEffect, useState } from "react";

const BIRTHDATE = "2009-04-15";

function getAge(birthDateString: string): number {
  const today = new Date();
  const birthDate = new Date(birthDateString);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

export default function AgeTimeCard() {
  const [time, setTime] = useState<string>("--:--:--");

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const age = getAge(BIRTHDATE);

  return (
    <p className="mt-2 text-zinc-300">
      Tenho <span className="font-semibold">{age}</span> anos.
    </p>
  );
}
