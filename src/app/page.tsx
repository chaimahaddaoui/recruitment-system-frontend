import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            
            <span className="text-xl font-bold text-gray-800">
              SmartHire
            </span>
          </div>

          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-black font-medium"
            >
              Connexion
            </Link>

            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              S'inscrire
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center max-w-2xl px-6">

          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Plateforme de Gestion des Candidatures
          </h1>

          <p className="text-gray-600 text-lg mb-8">
            Simplifiez votre processus de recrutement. 
            Publiez des offres, gérez les candidatures et trouvez 
            les meilleurs talents facilement.
          </p>

          <div className="flex justify-center gap-6">

            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Commencer
            </Link>

            <Link
              href="/auth/login"
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100"
            >
              Se connecter
            </Link>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-gray-500">
        &copy; {new Date().getFullYear()} SmartHire. Tous droits réservés.
      </footer>

    </div>
  );
}