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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Profile.less"></style>