export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Witaj na Mejcie!
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Informacje o łodzi
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Nazwa:</span>
                <span>Mejt</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Typ:</span>
                <span>Jacht żaglowy</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Długość:</span>
                <span>7.44m (24.4ft)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Data zwodowania:</span>
                <span>24.06.2023</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Szybkie statystyki
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Łączna liczba rejsów:</span>
                <span className="text-green-600 font-semibold">-</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Ostatni rejs:</span>
                <span>-</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Ulubione miejsce:</span>
                <span>Wierzba</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            O aplikacji
          </h3>
          <p className="text-blue-700 mb-3">
            Możesz dokumentować rejsy odwiedzając sekcję{" "}
            <a href="/logbook" className="underline font-medium">
              Dziennik
            </a>.{" "}
            Możesz dodawać nowe wpisy, śledzić lokalizacje, warunki pogodowe.
          </p>
          <p className="text-blue-700 mb-3">
            Zarządzaj wyposażeniem łodzi w sekcji{" "}
            <a href="/inventory" className="underline font-medium">
              Zapasy
            </a>.{" "}
            Śledź stan zapasów, dodawaj nowe oraz oznaczaj co trzeba dokupić.
          </p>
          <p className="text-blue-700">
            Planuj rejsy i rezerwuj łódź korzystając z{" "}
            <a href="/calendar" className="underline font-medium">
              Kalendarza
            </a>.{" "}
            Dodawaj nowe rezerwacje, sprawdzaj dostępność i przeglądaj nadchodzące wyprawy.
          </p>
        </div>
      </div>
    </div>
  );
}
