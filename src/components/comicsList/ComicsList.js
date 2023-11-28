import './comicsList.scss';
import useMarvelService from '../services/MarvelService';
import { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/errorMessage'

const ComicsList = () => {
    const [offset, setOffset] = useState(0)
    const [comicsList, setComicsList] = useState([])
    const [newComicsLoading, setNewComicsLoading] = useState(false)
    const {loading, error, getAllComics} = useMarvelService();
    const [enableButton, setEnableButton] = useState(false)
    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        setNewComicsLoading(!initial)
        getAllComics(offset)
            .then(onComicsListLoaded)
        setOffset(offset => offset + 8)
    }


    const onComicsListLoaded = (newComicsList) => {
        let enable = false
        if(newComicsList.length < 8) enable = true
        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setNewComicsLoading(false)
        setEnableButton(enable)
    }

    const renderComics = (arr) =>{
        const items = arr.map((item,i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return(
                <li className="comics__item" key={i}>
                <Link to={`/comics/${item.id}`}>
                    <img src={item.thumbnail} style={imgStyle} alt="ultimate war" className="comics__item-img"/>
                    <div className="comics__item-name">{item.title}</div>
                    <div className="comics__item-price">{item.price}</div>
                </Link>
            </li>
            )
        })
        return(
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderComics(comicsList)
    const spinner = loading && !newComicsLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div className="comics__list">
            {items}
            {spinner}
            {errorMessage}
            <button
                style={{display: enableButton ? 'none' : 'block'}}
                disabled={newComicsLoading}
                onClick={() => onRequest(offset)} 
                className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;