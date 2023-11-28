import { useHttp } from "../../hooks/http.hook"

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp()

    const _apiBase='https://gateway.marvel.com:443/v1/public/'
    const _apiKey = 'apikey=983c8b5523dcff0a441062344a88e3d4'
    const _baseOffset = 210

  

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`)
        return res.data.results.map(_transformCharacter)
    }

    const getCharacter =  async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`)
        return _transformCharacter(res.data.results[0])
    }

    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`)
        return res.data.results.map(_transformComics)
    }

    const getComic = async (id) => {
		const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
		return _transformComics(res.data.results[0]);
	};

    const getCharacterByName = async (name) => {
		const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
		return res.data.results.map(_transformCharacter);
	};

    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transformComics = (char) => {
        return{
            id: char.id,
            title: char.title,
            description: char.description,
            pageCount: char.pageCount ? `${char.pageCount} p.`: "No information about the number of pages",
			thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
			language: char.textObjects[0]?.language || "en-us",
			price: char.prices[0].price ? `${char.prices[0].price}$` : "not available",
        }
    }

    return{
        loading,
        error,
        getAllCharacters,
        getCharacter,
        clearError,
        getAllComics,
        getComic,
        getCharacterByName
    }

}

export default useMarvelService