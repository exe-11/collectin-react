import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Header from './Header';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Footer from './Footer';
import {useEffect, useState} from "react";
import {connect} from "react-redux";
import {getLatest, getTags, getItemsByCollectionId, getItemsByTag, download} from "../../store/reducer/collection";
import {useNavigate} from "react-router";
import {changeLanguage, getMe} from "../../store/reducer/user";
import {LANGUAGE, MODE} from "../../util/constants";
import {ENG, RUS} from "../../util/constants/language";


const theme = createTheme();

function Main({
                  collections,
                  tags,
                  content,
                  getLatest,
                  getTags,
                  user,
                  getItemsByCollectionId,
                  getItemsByTag,
                  download,
                  changeLanguage,
              }) {
    const navigate = useNavigate()

    const [lan, setLan] = useState(user.id ? user.language : localStorage.getItem(LANGUAGE) ? localStorage.getItem(LANGUAGE) : ENG)
    const [mode, setMode] = useState(localStorage.getItem(MODE) ? localStorage.getItem(MODE) : true)

    function choose_tag(tag_id) {
        getItemsByTag(tag_id)
        navigate('/itemsByTag')
    }


    useEffect(() => {
        if(!localStorage.getItem(MODE)) { localStorage.setItem(MODE, true)}
        getTags()
        getLatest()
        getMe()
    }, [])

    function changeLan() {
        const lang = lan === ENG ? RUS : ENG
        setLan(lang)
        localStorage.setItem(LANGUAGE, lang)
        changeLanguage(user.id, lang)
    }

    console.log('user-from-main',user)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Header mode={mode} setMode={setMode} title={'π²πΎπ»π»π΄π²ππΈπ½'} lan={lan} tags={tags}
                    choose_tag={choose_tag} changeLan={changeLan}
                    user={user} />
            {content ? content : collections[0] ? <main>
                <MainFeaturedPost collection={collections[0]} getItemsByCollectionId={getItemsByCollectionId}
                                  download={download}/>
                <Grid container spacing={4} alignItems={'center'}>
                    {
                        collections.map((collection, index) => (
                            index > 0 && index < 5 ? <FeaturedPost key={collection.id} collection={collection}
                                                                   getItemsByCollectionId={getItemsByCollectionId}
                                                                   download={download}/> : ''
                        ))}
                </Grid>
            </main> : ''}
            <Footer
                mode={mode}
                title={lan === ENG ? 'Online Creating Personal Collection' : 'ΠΠ½Π»Π°ΠΉΠ½-ΡΠΎΠ·Π΄Π°Π½ΠΈΠ΅ Π»ΠΈΡΠ½ΡΡ ΠΊΠΎΠ»Π»Π΅ΠΊΡΠΈΠΉ'}
                description={lan === ENG ? 'You can create a Business Collection template for payments that are made on a regular basis and contain much of the same information.' :
                    'ΠΡ ΠΌΠΎΠΆΠ΅ΡΠ΅ ΡΠΎΠ·Π΄Π°ΡΡ ΡΠ°Π±Π»ΠΎΠ½ Π±ΠΈΠ·Π½Π΅Ρ-ΠΊΠΎΠ»Π»Π΅ΠΊΡΠΈΠΈ Π΄Π»Ρ ΠΏΠ»Π°ΡΠ΅ΠΆΠ΅ΠΉ, ΠΊΠΎΡΠΎΡΡΠ΅ ΠΏΡΠΎΠΈΠ·Π²ΠΎΠ΄ΡΡΡΡ Π½Π° ΡΠ΅Π³ΡΠ»ΡΡΠ½ΠΎΠΉ ΠΎΡΠ½ΠΎΠ²Π΅ ΠΈ ΡΠΎΠ΄Π΅ΡΠΆΠ°Ρ Π±ΠΎΠ»ΡΡΡΡ ΡΠ°ΡΡΡ ΠΎΠ΄ΠΈΠ½Π°ΠΊΠΎΠ²ΠΎΠΉ ΠΈΠ½ΡΠΎΡΠΌΠ°ΡΠΈΠΈ.'}
            />
        </ThemeProvider>
    );
}

export default connect(({collection: {collections, tags}, user: {user}}) => ({collections, tags, user}),
    {
        getLatest,
        getTags,
        getItemsByCollectionId,
        getItemsByTag,
        download,
        changeLanguage,
        getMe
    })(Main)