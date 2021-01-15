// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [data, setData] = React.useState({
    pokemon: null,
    status: 'idle',
    error: null,
  })

  React.useEffect(() => {
    if (pokemonName) {
      setData({status: 'pending'})
      fetchPokemon(pokemonName)
        .then(pokemon => {
          setData({pokemon, status: 'resolved'})
        })
        .catch(error => {
          setData({error, status: 'rejected'})
        })
    }
  }, [pokemonName])

  if (data.status === 'rejected') {
    throw data.error
  }

  switch (data.status) {
    case 'idle':
      return 'Submit a pokemon'
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'resolved':
      return <PokemonDataView pokemon={data.pokemon} />
    default:
      return 'Unknown status'
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={({error, resetErrorBoundary}) => (
            <div role="alert">
              There was an error:{' '}
              <pre style={{whiteSpace: 'normal'}}>
                {error.message}
              </pre>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
          onReset={() => setPokemonName('')}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
