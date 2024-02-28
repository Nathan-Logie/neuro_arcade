import {GameForm} from "../../components/add_content/GameForm";
import styles from "../../styles/App.module.css";
import {Banner, MobileBanner} from "../../components/Banner";
import {NavBar} from "../../components/NavBar";
import {motion} from "framer-motion";
import {ModelForm} from "../../components/add_content/ModelForm";
import {Button} from "../../components/Button";
import {GameUpdateForm} from "../../components/add_content/UpdateGameForm";
import {ModelUpdateForm} from "../../components/add_content/UpdateModelForm";

/**
 * @returns {JSX.Element} add game page
 * @constructor builds add game page
 */
export function FormPage({type}) {

    let nav_left = (
        <Button
            name={'user account'}
            link={'/user_account'} //TODO add user specific page
            orientation={'left'}
            direction={'left'}
        />
    );

    let form;
    let title;
    if (type === 'game') {
        form = <GameForm/>;
        title = "Add Game"
    } else if (type === 'model') {
        form  = <ModelForm/>
        title = "Add Model"
    } else if (type==='gameUpdate'){
        form = <GameUpdateForm/>
        title = "Update Game"
    }
    else if (type==='modelUpdate'){
        form = <ModelUpdateForm/>
        title="Update Model"

    }
    else {
        throw('invalid form type');
    }

    return(
        <>
            <Banner size={'big'} left={nav_left} />
            <MobileBanner/>
            <NavBar left={nav_left} />
            <motion.div
                className={styles.MainBlock}
                id={styles['big']}
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
            >
                <div className={styles.Form}>
                    <h1 className={styles.Header}>{title}</h1>
                    {form}
                </div>
            </motion.div>
            <div className={styles.MobileBannerBuffer}/>
        </>
    )
}
