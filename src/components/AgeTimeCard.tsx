import React, { useEffect, useState } from "react";

const BIRTHDATE = new Date("2009-04-15");

function calculateAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function AgeTimeCard() {
  const [age, setAge] = useState(0);

  useEffect(() => {
    setAge(calculateAge(BIRTHDATE));
  }, []);

  return (
    <p className="text-zinc-200">
      Tenho {age} anos e sou apaixonado por tecnologia.
    </p>
  );
}