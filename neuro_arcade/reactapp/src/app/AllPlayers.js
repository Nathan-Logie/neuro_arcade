import {Banner, MobileBanner} from "../components/Banner";
import styles from "../styles/App.module.css";
import {PlayerGrid, PlayerGridMode} from "../components/PlayerGrid";
import {TagFilter} from "../components/TagFilter";
import {requestPlayerTags} from "../backendRequests";
import React, {useEffect, useState} from "react";
import {FaMagnifyingGlass} from "react-icons/fa6";
import {Switcher} from "../components/Switcher";
import {motion} from "framer-motion";
import {IoFilter} from "react-icons/io5";
import {useArraySearchParam, useSearchParam} from "../urlHelpers";

/**
 * @returns {JSX.Element} all players page
 * @constructor builds all players page
 */
export function AllPlayers() {
    // name query for sorting the already fetched players
    // can be changed freely, as it only affect data displayed on the client
    let [textQuery, setTextQuery] = useSearchParam("query", "", {replace: true});
    let [tags, setTags] = useState([]);
    let [selectedTags, setSelectedTags] = useArraySearchParam("tags", {replace: true});
    let [loading, setLoading] = useState(true);

    const [selectedSwitcherValue, setSelectedSwitcherValue] = useSearchParam("mode", "all", {replace: true});

    /**
     * Converts a mode's display name into the enum used by PlayerGrid
     *
     * TODO: this is hacky, Switcher's API should probably be refactored to some extent
     *
     * @param {string} displayName
     * @returns {PlayerGridMode} mode
     */
    function convertModeName(displayName) {
        if (displayName === "AI Platforms") return PlayerGridMode.AI;
        if (displayName === "Humans") return PlayerGridMode.HUMAN;
        return PlayerGridMode.ALL;
    }

    const switcher_labels = {
        table_headers: [{name: "AI Platforms"}, {name: "all"}, {name: "Humans"}]
    };
    const [show, setShow] = useState(false);
    const [hover, setHover] = useState(false);

    useEffect(() => {
        requestPlayerTags().then((tags) => {
            setTags(tags);
            setLoading(false);
        });
    }, []);

    function onTagChange(selection) {
        setSelectedTags(tags.filter((tag, i) => selection[i]).map((tag) => tag.slug));
    }

    const smallTagFilter = (
        <TagFilter
            onTagChange={onTagChange}
            initialTicks={tags.map((tag) => selectedTags.includes(tag.slug))}
            tags={tags.map((tag) => tag.name)}
            id={show ? "all" : "invisible"}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
        />
    );

    const largeTagFilter = (
        <TagFilter
            onTagChange={onTagChange}
            initialTicks={tags.map((tag) => selectedTags.includes(tag.slug))}
            tags={tags.map((tag) => tag.name)}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
        />
    );

    let content = <>...</>;
    if (!loading) {
        content = (
            <>
                <div className={styles.Side}>
                    <div className={styles.Search}>
                        <input onChange={(e) => setTextQuery(e.target.value)} defaultValue={textQuery} placeholder='search...' />
                        <div className={styles.SearchIcon}>
                            <FaMagnifyingGlass />
                        </div>
                    </div>
                    <div className={styles.Switcher}>
                        <Switcher
                            data={switcher_labels}
                            onSwitcherChange={setSelectedSwitcherValue}
                            switcherDefault={selectedSwitcherValue}
                        />
                    </div>
                    {largeTagFilter}
                </div>
                <div className={styles.Content} id={styles["big"]}>
                    <div className={styles.Title}>
                        <h1>All Players</h1>
                        <motion.div
                            className={styles.FilterButton}
                            id={styles["all"]}
                            onClick={() => setShow(!show)}
                            whileHover={{scale: 1.1}}
                            whileTap={{scale: 0.9}}
                        >
                            <IoFilter />
                        </motion.div>
                    </div>
                    {smallTagFilter}
                    <PlayerGrid
                        mode={convertModeName(selectedSwitcherValue)}
                        textQuery={textQuery}
                        tagQuery={tags.filter((tag) => selectedTags.includes(tag.slug)).map((tag) => tag.id)}
                    />
                </div>
            </>
        );
    }

    return (
        <div onClick={() => (show && !hover ? setShow(false) : null)}>
            <Banner size={"small"} selected={"Players"} />
            <MobileBanner />
            <motion.div
                className={styles.MainBlock}
                id={styles["small"]}
                initial={{opacity: 0, y: -100}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -100}}
            >
                {content}
                <div className={styles.MobileBannerBuffer}/>
            </motion.div>
        </div>
    );
}
