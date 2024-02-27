import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import {FaImage, FaPlus, FaPython} from "react-icons/fa6";
import CreatableSelect from 'react-select/creatable';
import {
    requestPlayerTags,
    getUser,
    getHeaders,
    API_ROOT,
    requestPlayer,
    requestGame,
    requestGameTags
} from "../../backendRequests";
import slugify from 'react-slugify';
import makeAnimated from 'react-select/animated';
import {
    MAX_DESCRIPTION_LENGTH_MODEL,
    MAX_NAME_LENGTH_MODEL,
    IMAGE_EXTENSION,
    MAX_NAME_LENGTH_GAME, MAX_DESCRIPTION_LENGTH_GAME
} from "./variableHelper";
import {useNavigate, useParams} from "react-router-dom";
import {LuFileJson} from "react-icons/lu";


const customStyles = {
    option: provided => ({...provided, color: 'white'}),
    control: provided => ({...provided, color: 'black', backgroundColor: 'rgba(255, 255, 255, 0.2)', border: 'none', borderRadius: '0.5em', marginBottom: '1em'}),
    valueContainer: provided => ({...provided, height: 'max-content'}),
    placeholder: provided => ({...provided, color: '#CCCCCC', textAlign: 'left', fontSize: '0.9em', paddingLeft: '1em'}),
    input: provided => ({...provided, color: '#FFFFFF', paddingLeft: '1em', fontSize: '0.9em'}),
    multiValue: provided => ({...provided, backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', borderRadius: '0.5em'}),
    multiValueLabel: provided => ({...provided, color: 'white'}),
    multiValueRemove: provided => ({...provided, borderRadius: '0.5em'}),
    menu: provided => ({...provided, borderRadius: '0.5em', position: 'relative'})
}

export function ModelForm() {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting, touchedFields},
        setError,
        reset
    } = useForm()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    let [tags, setTags] = useState([])
    const [existingTags, setExistingTags] = useState([])
    const [options, setOptions] = useState([])
    const [user, setUser] = useState(null)
    const [image, setImage] = useState(null)
    const player_name = useParams().player_slug;
    const [loading, setLoading] = useState(true)
    const [currentValues, setCurrentValues] = useState(null);
    const [header, setHeader] = useState(null)
    const [imageURL, setImageURL] = useState(null);


    useEffect(() => {
        requestPlayer(player_name)
            .then((currentData) => {
                setCurrentValues(currentData.game);
                getHeaders("PATCH", true).then((header) => {
                    header.headers["Content-Type"] = "multipart/form-data";
                    setHeader(header);
                    requestPlayerTags()
                        .then((tags) => {
                            setExistingTags(tags);
                            setImageURL(`${API_ROOT}/${currentData.game.icon}`)
                            setLoading(false)
                            console.log(currentValues)
                        })
                })
            })
    }, [])

    existingTags.forEach((tag) => {
        options.push({
            value: tag.id,
            label: tag.name
        })
    })

    function handleTagReset() {
        options.forEach((option) => {
            if (currentValues.tags.includes(option.value)) {
                tags.push(option)
            }
        })
    }

    const handleImage = (event) => {
        const file = event.target.files[0];
        const acceptedFormats = ACCEPTED_IMAGE;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!acceptedFormats.includes(fileExtension)) {
            setError("root", {message: "Invalid file type provided"})
            setImage(null)
        } else {
            setImage(file)
        }
    }

    function handleCreate(tagName) {
        let formData = new FormData()
        formData.append("name", tagName)
        formData.append("slug", slugify(tagName))
        formData.append("description", "described")
        axios({
            method: "post",
            url: `${API_ROOT}/api/playerTag/`,
            data: formData,
            headers: header,
        }).then((response) => {
            console.log(response)
            let newValue = {
                value: response.data.id,
                label: response.data.name
            }
            setOptions((prev) => [...prev, newValue]);
            setTags((prev) => [...prev, newValue]);


        }).catch(() => {
                setError("tags", {message: "Error creating new tag"})
            }
        )
    }

    const onSubmit = async (event) => {

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("user", user);
        formData.append("is_ai", true);
        if (image) {
            formData.append("icon", image)
        }

        await axios({
            //I will move a lot of this stuff to backend requests to centralize it in a future merge request
            method: "post",
            url: `${API_ROOT}/api/players/`,
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        }).then(function (response) {
            console.log(response);

            if (tags.length !== 0) {
                const finalTagIDs = tags.map((tag) => tag.value);
                formData.append("tags", finalTagIDs)
                axios({
                    method: "post",
                    url: `${API_ROOT}/api/players/${response.data.id}/add_tags/`,
                    data: formData,
                    headers: header,
                }).catch((response) => {
                        console.log(response)
                        setError("root", {message: "Error during tag upload"})
                    }
                )
            }
            reset()
            setImage(null)
            setError("root", {message: "model submitted successfully"})
            setTags(null)
        }).catch(function (response) {
            console.log(response)
            if (!response) {
                setError("root", {message: "No response from server"});
            } else {
                if (response.response.data.slug) {
                    setError("root", {message: "A Model with that name already exists!"});
                    return;
                } else if (response.response.data.tags) {
                    setError("root", {message: "Tag upload failed"});
                    return;
                }
                if (response)
                    if (response.response.data.includes("IntegrityError")) {
                        setError("root", {message: "A Model with that name already exists!"});
                    } else {
                        setError("root", {
                            message: `Something went wrong... ${response.response.data}`
                        })
                    }
            }
        });
    }

    if (!loading) {
        return (
            <form onSubmit={handleSubmit(onUpdate)}>
                <h3> {currentValues.name} </h3>
                <input  {...register("name", {
                    maxLength: {
                        value: MAX_NAME_LENGTH_GAME,
                        message: `Maximum game title length has been exceeded (${MAX_NAME_LENGTH_GAME})`,
                    }
                })} type={"text"} placeholder={"game name"} defaultValue={currentValues.name}
                        onChange={(event) => setName(event.target.value)}
                />
                {errors.name && (
                    <div>{errors.name.message}</div>
                )}

                <h3>Description</h3>
                <input {...register("description", {
                    maxLength: {
                        value: MAX_DESCRIPTION_LENGTH_GAME,
                        message: `Maximum description length has been exceeded (${MAX_DESCRIPTION_LENGTH_GAME})`,
                    }
                })} type={"text"} placeholder={"This game measures..."} defaultValue={currentValues.description}
                       onChange={(event) => setDescription(event.target.value)}
                />
                {errors.description && (
                    <div>{errors.description.message}</div>
                )}

                <h3>Game Tags</h3>
                <CreatableSelect
                    isClearable
                    isMulti
                    defaultValue={currentValues.tags}
                    onChange={(newValue) => setTags(newValue)}
                    onCreateOption={handleCreate}
                    value={tags}
                    options={options}
                    components={makeAnimated()}
                    styles={customStyles}
                    placeholder={"Search..."}
                />
                {errors.tags && (
                    <div>{errors.tags.message}</div>
                )}

                <h3>Play Link</h3>
                <input {...register("playLink", {
                    validate: (value) => {
                        try {
                            let url = new URL(value)
                        } catch (error) {
                            return "Invalid URL Provided"
                        }
                        return true
                    }
                })} type={"text"} placeholder={"https://link"} defaultValue={currentValues.play_link}
                       onChange={(event) => setPlayLink(event.target.value)}/>
                {errors.playLink && (
                    <div>{errors.playLink.message}</div>
                )}


                <span>
                <div>
                    <h3>Game Icon</h3>
                    <motion.div
                        whileHover={{scale: 1.1}}
                        whileTap={{scale: 0.9}}
                    >
                        <label htmlFor={'icon'}>
                            <p>
                                {image ? image.name : 'No file chosen'}
                            </p>
                            <div>
                                <FaImage/>
                            </div>
                        </label>
                        <input id={'icon'} {...register("icon", {
                            required: false,

                        })} type={"file"} accept={"image/*"} onChange={handleImage}/>
                    </motion.div>
                    <h2>Current image</h2>
                    <img src={imageURL} alt='icon'/>
                </div>

            </span>

                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                >
                    {"Save Changes"}
                    <div>
                        <FaPlus/>
                    </div>
                </motion.button>
                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    onClick={handleSubmit(handleReset)}
                >
                    {"RESET"}
                    <div>
                        <FaPlus/>
                    </div>
                </motion.button>
                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    onClick={handleSubmit(handleDelete)}
                >
                    {"Delete Game"}
                    <div>
                        <FaPlus/>
                    </div>
                </motion.button>
                {errors.root && (
                    <div>{errors.root.message}</div>
                )}
            </form>
        );
    } else {
        return (
            <div>
                Loading...
            </div>
        )
    }
}
