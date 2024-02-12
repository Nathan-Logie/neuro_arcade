import {Banner, MobileBanner} from "../components/Banner";
import styles from "../styles/App.module.css"
import {GameGrid} from "../components/GameGrid";
import {TagFilter} from "../components/TagFilter";
import {requestGameTags} from "../backendRequests";
import {useEffect, useState} from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

/**
 * @returns {JSX.Element} all games page
 * @constructor builds all games page
 */
export function AllGames() {
    // name query for sorting the already fetched games
    // can be changed freely, as it only affect data displayed on the client
    let [textQuery, setTextQuery] = useState('');
    let [tags, setTags] = useState([]);
    let [selectedTags, setSelectedTags] = useState([]);
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        requestGameTags()
            .then((tags) => {
                setTags(tags);
                setLoading(false);
            })
    }, [])

    if (loading) {
        return <>
            Loading...
        </>
    }

    return (
        <>
            <Banner size={'small'} state={'Games'} />
            <MobileBanner  />
            <div className={styles.MainBlock} id={styles['small']}>
                <div className={styles.Side}>
                    <div className={styles.Search}>
                        <input onChange={e => setTextQuery(e.target.value)} placeholder="search..."/>
                        <div className={styles.SearchIcon}>
                            <FaMagnifyingGlass />
                        </div>
                    </div>
                    <TagFilter
                        tags={tags.map((tag) => tag.name)}
                        onTagChange={setSelectedTags}
                    />
                </div>
                <div className={styles.Content} id={styles['AllGames']}>
                    <h1>All Games</h1>
                    <GameGrid
                        textQuery={textQuery}
                        tagQuery={tags.filter((tag, i) => selectedTags[i]).map((tag) => tag.id)}
                        id={'AppGrid'}
                    />
                </div>
            </div>
        </>
    );
}
