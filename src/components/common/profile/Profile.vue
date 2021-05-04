<template src="./Profile.html"></template>

<script>
import config from '@/config/config'
import DwellerCachingHelper from '@/classes/DwellerCachingHelper'

export default {
    name: 'Profile',
    data() {
        return {
            loading: true,
            isFriend: false,
            isSelf: false,
            account: false,
            cache: new DwellerCachingHelper(
                this.$ethereum,
                config.registryAddress,
                config.cacher.dwellerLifespan
            ),
        }
    },
    methods: {
        /** @method
         * Check if a given address is from a verified user
         * @name isVerified
         * @returns boolean if verified
         */
        isVerified (address) {
            return config.verified_addresses.includes(address)
        },
        /** @method
         * Check if the given address is an active account, if so set it
         * @name isAccount
         * @returns returns user or null
         */
        async isAccount() {
            const user = await this.cache.getDweller(this.$store.state.viewingProfile)
            return user
        },
        /** @method
         * Update all store values so to chat with the given client
         * @name chatFriend
         * @argument address client to chat with referenced by address
         */
        chatFriend () {
            this.$store.commit('newChat', this.$store.state.viewingProfile)
            this.$store.dispatch('setActiveChat', { friendAddress: this.$store.state.viewingProfile })
            this.$store.commit('changeRoute', 'main')
            this.$store.commit('viewProfile', false)
        },
        /** @method
         * Check if the set address is a friend or not
         * also checks if it's ourself
         * @name checkFriend
         */
        checkFriend () {
            const friendAddresses = this.$store.state.friends.map(fr => fr.address)
            const isFriend = friendAddresses.includes(this.$store.state.viewingProfile)
            this.isFriend = isFriend
            this.isSelf = this.$store.state.viewingProfile === this.$store.state.activeAccount
        }
    },
    async mounted() {
        this.checkFriend()
        const isAccount = await this.isAccount()
        if (isAccount) {
            this.account = isAccount
        } else {
            this.account = false
        }
        this.loading = false
    }
}
</script>

<<<<<<< HEAD
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Profile.less"></style>
=======
<style scoped lang="less">
    .modal-card-body {
        padding: 0;
        border-radius: 4px;

        .verified-badge {
            font-size: 13pt;
            top: 0.4rem;
            right: -1.5rem;
            position: absolute;
        }

        .note-holder {
            padding: 0 2rem 2rem 2rem;

            textarea {
                font-family: 'Space Mono', monospace;
                background-color: #0d0d12 !important;
            }
        }

        .profile-header-bg {
            width: 100%;
            height: 15rem;
            background-image: url(https://gateway.pinata.cloud/ipfs/QmTu69jtH6J9QUJ7B7tedpVChhwt3Yv3FGCCS9DMSns4R6);
            background-size: cover;
            background-position: center;
            box-shadow: inset 0px -40px 40px rgb(0 0 0 / 50%);
            position: relative;

        }
        .profile-photo {
            margin-bottom: 5rem;

            img {
                width: 10rem;
                margin: -6.5em 2rem 0;
                // box-shadow: 0 0 20px rgb(0 0 0 / 50%);
                border: 2px solid #101016 !important;
                position: absolute;
            }
        }

        .username-container {
            position: absolute;
            bottom: 1rem;
            left: 14rem;
            text-shadow: 0px 0px 15px black;

            h1 {
                font-family: 'Space Mono', monospace;
                font-size: 22pt;
                color: #fff;
                font-weight: bold;
            }
            p {
                color: #fff;
            }
        }

        .quick-actions {
            position: absolute;
            top: 16rem;
            right: 0;
            left: 14rem;
        }
        @media (max-width: 768px) {
            .username-container {
                position: absolute;
                bottom: -8.5rem;
                left: 2rem;
                right: 2rem;
                text-align: center;
            }

            .quick-actions {
                position: unset;
                padding: 0 2rem;
                margin-bottom: 1rem;
                text-align: center;

                .button {
                    font-size: 11pt;
                }
            }
            
            .profile-photo {
                margin-bottom: 9.5rem;
                img {
                    margin: -6.5em 2rem 0 calc(50% - 5rem);
                }
            }

            .verified-badge {
                right: unset;
            }
        }
    }
    .modal-close {
        z-index: 10000;
        background: #000 !important;
    }
</style>
>>>>>>> 978076802bcf277c3d5d6ab8bbc2151ba33e6d6b
