<script setup>
    const route = useRoute()
    const playlist = {
        imageUrl: "https://i.imgur.com/XcrxO8z.jpeg",
        author: { name: "Apexo", imageUrl: "https://i.imgur.com/XcrxO8z.jpeg" },
        songs: [
            { name: "Sex feels better with you", author: "NOGA aka объеBOSS", imageUrl: "https://i.imgur.com/XcrxO8z.jpeg", streams: 10000, time: 60 * 3 + 20 },
            { name: "Sex feels better with you", author: "NOGA aka объеBOSS", imageUrl: "https://i.imgur.com/XcrxO8z.jpeg", streams: 10000, time: 60 * 3 + 20 },
            { name: "Sex feels better with you", author: "NOGA aka объеBOSS", imageUrl: "https://i.imgur.com/XcrxO8z.jpeg", streams: 10000, time: 60 * 3 + 20 },
            { name: "Sex feels better with you", author: "NOGA aka объеBOSS", imageUrl: "https://i.imgur.com/XcrxO8z.jpeg", streams: 10000, time: 60 * 3 + 20 }
        ]
    }
</script>

<template>
    <div class="playlistInfo">
        <img class="playlistImage" :src="playlist.imageUrl" alt="">
        <div>
            <p class="playlistName">Мне нравится</p>
            <div class="playlistContainer">
                <p>{{ playlist.author.name }}</p>
            </div>
        </div>
    </div>

    <div class="playlistButtons">
        <!-- Play button -->
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <g clip-path="url(#clip0_4442_4271)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42Z" fill="#020202"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48ZM34.0478 25.7352C35.3174 24.9678 35.3174 23.029 34.0478 22.2614L20.8244 14.266C19.5656 13.5049 18 14.4677 18 16.003V31.9938C18 33.529 19.5656 34.4918 20.8244 33.7306L34.0478 25.7352Z" fill="#A887F8"/>
            </g>
            <defs>
                <clipPath id="clip0_4442_4271">
                <rect width="48" height="48" fill="white"/>
                </clipPath>
            </defs>
        </svg>

        <!-- Like button -->
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <g clip-path="url(#clip0_4442_4274)">
                <path d="M21.1893 5.00786C19.3027 5.09169 17.6106 5.84503 16.1443 7.23235L15.9922 7.38141L15.8339 7.22643C14.2613 5.75666 12.457 5 10.4547 5C6.3503 5 3 8.36296 3 12.5097C3 16.565 4.46553 18.4883 11.0372 23.7348L14.5316 26.4901C15.3949 27.17 16.6051 27.17 17.4684 26.4901L20.5418 24.0699L21.755 23.0982C27.6541 18.3243 29 16.3961 29 12.5097C29 8.36296 25.6497 5 21.5453 5L21.1893 5.00786ZM21.5453 7.36433C24.3608 7.36433 26.66 9.67224 26.66 12.5097L26.6536 12.8953C26.5549 15.7281 25.2731 17.2841 19.4919 21.8959L16.03 24.6253C16.0123 24.6391 15.9877 24.6391 15.97 24.6253L12.8966 22.205L11.7607 21.2963C6.37581 16.95 5.34 15.4645 5.34 12.5097C5.34 9.67224 7.63922 7.36433 10.4547 7.36433C12.1875 7.36433 13.713 8.17554 15.0949 9.88005C15.5661 10.4612 16.4473 10.4567 16.9126 9.87069C18.2606 8.173 19.7813 7.36433 21.5453 7.36433Z" fill="#EBEBEB"/>
                <path d="M21.1893 5.00786C19.3027 5.09169 17.6106 5.84503 16.1443 7.23235L15.9922 7.38141L15.8339 7.22643C14.2613 5.75666 12.457 5 10.4547 5C6.3503 5 3 8.36296 3 12.5097C3 16.565 4.46553 18.4883 11.0372 23.7348L14.5316 26.4901C15.3949 27.17 16.6051 27.17 17.4684 26.4901L20.5418 24.0699L21.755 23.0982C27.6541 18.3243 29 16.3961 29 12.5097C29 8.36296 25.6497 5 21.5453 5L21.1893 5.00786ZM21.5453 7.36433C24.3608 7.36433 26.66 9.67224 26.66 12.5097L26.6536 12.8953C26.5549 15.7281 25.2731 17.2841 19.4919 21.8959L16.03 24.6253C16.0123 24.6391 15.9877 24.6391 15.97 24.6253L12.8966 22.205L11.7607 21.2963C6.37581 16.95 5.34 15.4645 5.34 12.5097C5.34 9.67224 7.63922 7.36433 10.4547 7.36433C12.1875 7.36433 13.713 8.17554 15.0949 9.88005C15.5661 10.4612 16.4473 10.4567 16.9126 9.87069C18.2606 8.173 19.7813 7.36433 21.5453 7.36433Z" fill="#020202" fill-opacity="0.2"/>
            </g>
            <defs>
                <clipPath id="clip0_4442_4274">
                <rect width="32" height="32" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    </div>

    <table class="playlistSongs">
        <tr class="playlistSongsTitles">
            <th>#</th>
            <th>Название</th>
            <th>Прослушивания</th>
            <th>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.5C4.9624 2.5 2.5 4.9624 2.5 8C2.5 11.0376 4.9624 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.9624 11.0376 2.5 8 2.5ZM1 8C1 4.134 4.134 1 8 1C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM7.25 4C7.44891 4 7.63968 4.07902 7.78033 4.21967C7.92098 4.36032 8 4.55109 8 4.75V8.267L10.3104 9.3172C10.4886 9.40132 10.6266 9.55219 10.6944 9.73721C10.7623 9.92222 10.7546 10.1265 10.6731 10.3059C10.5915 10.4853 10.4427 10.6254 10.2586 10.6959C10.0746 10.7665 9.87026 10.7617 9.6897 10.6828L6.9397 9.4328C6.80859 9.37322 6.69741 9.27714 6.61943 9.15606C6.54146 9.03498 6.5 8.89401 6.5 8.75V4.75C6.5 4.55109 6.57902 4.36032 6.71967 4.21967C6.86032 4.07902 7.05109 4 7.25 4Z" fill="#EBEBEB"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.5C4.9624 2.5 2.5 4.9624 2.5 8C2.5 11.0376 4.9624 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.9624 11.0376 2.5 8 2.5ZM1 8C1 4.134 4.134 1 8 1C11.866 1 15 4.134 15 8C15 11.866 11.866 15 8 15C4.134 15 1 11.866 1 8ZM7.25 4C7.44891 4 7.63968 4.07902 7.78033 4.21967C7.92098 4.36032 8 4.55109 8 4.75V8.267L10.3104 9.3172C10.4886 9.40132 10.6266 9.55219 10.6944 9.73721C10.7623 9.92222 10.7546 10.1265 10.6731 10.3059C10.5915 10.4853 10.4427 10.6254 10.2586 10.6959C10.0746 10.7665 9.87026 10.7617 9.6897 10.6828L6.9397 9.4328C6.80859 9.37322 6.69741 9.27714 6.61943 9.15606C6.54146 9.03498 6.5 8.89401 6.5 8.75V4.75C6.5 4.55109 6.57902 4.36032 6.71967 4.21967C6.86032 4.07902 7.05109 4 7.25 4Z" fill="#020202" fill-opacity="0.2"/>
                </svg>
            </th>
        </tr>
        <template v-for="(song, index) of playlist.songs">
            <tr class="songContainer">
                <td>{{ index + 1 }}</td>
                <td class="songInfo">
                    <img class="songImage" :src="song.imageUrl" alt="">
                    <div>
                        <p>{{ song.name }}</p>
                        <p>{{ song.author }}</p>
                    </div>
                </td>
                <td>{{ song.streams }}</td>
                <td>{{ (song.time - song.time % 60) / 60 }}:{{ song.time % 60 }}</td>
            </tr>
        </template>
    </table>
</template>

<style lang="scss" scoped>
    // info
    .playlistInfo {
        display: flex;
        width: 100%;
        height: 236px;
        padding: 25px;
        align-items: center;
        gap: 50px;

        border-radius: 48px;
        background: #0A0A0A;
    }

    .playlistImage {
        width: 186px;
        height: 186px;
        flex-shrink: 0;
        border-radius: 25px;
    }

    .playlistContainer {
        display: flex;
        margin-top: 10px;
        align-items: center;
    }

    .playlistName {
        font-size: 48px;
        font-weight: 600;
        color: #EBEBEB;   
    }


    // buttons
    .playlistButtons {
        display: flex;
        align-items: center;
        gap: 20px;

        margin: 24px 0;
        margin-left: 24px;
    }


    // songs
    .playlistSongs {
        width: 100%;
    }

    .playlistSongsTitles {
        text-align: left;

        & > th {
            &:first-child {
                padding-right: 0;
                width: 5%;
            }

            &:nth-child(2) {
                width: 60%;
            }

            &:nth-child(3) {
                width: 35%;
            }

            padding: 20px 25px;
            padding-left: 0;

            border-bottom: 1.5px solid #121212;
        }
    }

    .songContainer {
        & > td {
            padding: 10px 64px;
            padding-left: 0;
        }
    }

    .songInfo {
        display: flex;
        align-items: center;
        gap: 15px
    }
    .songImage {
        width: 40px;
        height: 40px;
        border-radius: 4px;
    }
</style>