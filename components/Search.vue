<script setup>
const searchString = ref(null)
</script>

<template>
    <form action="/search" method="get">
        <div class="inputSearch">
            <input 
            name="stirng"
            type="search"
            class="icon icon_lock"  
            placeholder="Поиск"
            v-model="searchString"
            minlength="1" required>
        </div>
    </form>
</template>

<style lang="scss">
    .inputSearch {      
        input[type=search] {
            // Текст
            font-size: 18px;
            color: #BCBCBC;

            // Инпут
            width: 100%;
            resize: none;
            outline: none;
            border-radius: 8px;
            padding: 10px 0px 10px 16px;

            box-sizing: border-box;
            background-color: #0B0B0B;
            border: 2px solid #0B0B0B;
            transition: border .2s linear;

            &.icon {
                padding-left: 65px;
                background-size: 24px;
                background-repeat: no-repeat;
                background-position: left;
                background-position-x: 25px;

                background-image: url('icons/home/search.svg');
            }
            
            &:focus {
                border: 2px solid #A887F8;
            }
        
            &::placeholder {
                font-size: 18px;
            }
        }
    }
    
</style>