<template>
    <div class="authContainer">
        <div class="authLogo">
            <svg width="82" height="42" viewBox="0 0 82 42" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_833_4381)">
            <path d="M82 0L46.7477 42L32.1869 26.25L0 42L8.04673 31.5L16.0935 21L24.1402 10.5L32.1869 0L46.7477 15.75L82 0Z"/>
            </g>
                <defs>
                    <clipPath id="clip0_833_4381">
                        <rect width="82" height="42"/>
                    </clipPath>
                </defs>
            </svg>
        </div>
        <div class="authMain">
            <slot />
        </div>
    </div>
</template>

<style lang="scss">
    .authContainer {
        display: flex;
    }

    .authLogo, .authMain {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .authLogo {
        background-color: #A887F8;

        width: 50%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #A887F8;

        & svg {
            height: 300px;
            width: auto;
        }
    }
</style>