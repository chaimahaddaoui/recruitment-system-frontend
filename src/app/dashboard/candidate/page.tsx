"use client";

import { useEffect, useState } from "react";

export default function CandidateDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Candidate Dashboard
      </h1>

      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md">

          <h2 className="text-xl font-semibold mb-4">
            Informations utilisateur
          </h2>

          <p className="mb-2">
            <span className="font-bold">ID :</span> {user.sub}
          </p>

          <p className="mb-2">
            <span className="font-bold">Email :</span> {user.email}
          </p>

          <p className="mb-2">
            <span className="font-bold">Role :</span> {user.role}
          </p>

        </div>
      ) : (
        <p>Chargement...</p>
      )}

    </div>
  );
}