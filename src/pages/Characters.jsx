import { useEffect, useState } from "react"
import { CharacterCard } from "@/components/CharacterCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// Componente principal que muestra la lista paginada de personajes
export default function Characters() {
  const [characters, setCharacters] = useState([]) // Lista de personajes actuales
  const [page, setPage] = useState(1)              // Página actual para la paginación (osea la pagina incial)
  const [info, setInfo] = useState(null)           // Información adicional de la API (si es next, prev)
  const [loading, setLoading] = useState(true)     // Estado de carga para mostrar spinner o mensaje de carga

  // Función para obtener personajes y sus episodios desde la API según la página en la que esté
  const fetchCharacters = async (page) => {
    setLoading(true) // Muestra el indicador de carga
    try {
      // Llama a la API de personajes
      const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
      const data = await res.json()

      // Complementa cada personaje con los detalles de sus episodios y agrega el nombre en lugar de urls
      const enrichedCharacters = await Promise.all(
        data.results.map(async (char) => {
          // Extrae los ids de los episodios del personaje
          const episodeIds = char.episode.map((url) => url.split("/").pop())

          // Obtiene los detalles de los episodios
          const episodesRes = await fetch(`https://rickandmortyapi.com/api/episode/${episodeIds.join(",")}`)
          const episodesData = await episodesRes.json()

          // Asegura que los datos estén como un array
          const episodeDetails = Array.isArray(episodesData) ? episodesData : [episodesData]

          // Devuelve el personaje con los detalles de los episodios añadidos
          return {
            ...char,
            episodeDetails,
          }
        })
      )

      setCharacters(enrichedCharacters) // Guarda los personajes con el detalle
      setInfo(data.info)                // Guarda info para paginación
    } catch (error) {
      console.error("Error fetching characters:", error)
    } finally {
      setLoading(false) // Quita el indicador de carga
    }
  }

  // Ejecuta la carga inicial y cada vez que cambia la página
  useEffect(() => {
    fetchCharacters(page)
  }, [page])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Rick and Morty Characters</h1>

      <Separator className="mb-6" />

      {/* Muestra un mensaje de carga o la grilla de personajes */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p> // Mostrar mientras carga
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Mapea cada personaje y lo muestra con CharacterCard */}
          {characters.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      )}

      {/* Botones para navegar entre páginas */}
      <div className="flex justify-center gap-4 mt-8">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={!info?.prev} // Deshabilita si no hay página anterior
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage((p) => (info?.next ? p + 1 : p))}
          disabled={!info?.next} // Deshabilita si no hay página siguiente
        >
          Next
        </Button>
      </div>
    </div>
  )
}
