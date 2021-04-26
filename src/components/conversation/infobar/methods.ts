/** @method
 * Triggers a screenshare request event to the store
 * subscribers will be notified to start a share
 * @name requestScreenShare
 */
const requestScreenShare = function(this: any): void {
    this.$store.commit('screenShareRequest')
}

/** @method
 * @depricated
 * Toggles the ID card modal
 * @name requestScreenShare
 */
const toggleFingerprint = function(this: any): void {
    this.$store.commit('toggleUserInfo')
}

export { requestScreenShare, toggleFingerprint }