<template src="./Badge.html"></template>

<script>
export default {
  name: 'Badges',
  props: ['address', 'showNoBadges'],
  methods: {
    /** @method
     * @name isRank
     * @argument rank string rang to check for
     * @returns boolean of wether or not the user had the specified rank
     */
    isRank (rank) {
      return this[rank].includes(this.address)
    },
    /** @method
     * @name hasNoRank
     * @returns boolean of wether or not the user has a rank
     */
    hasNoRank () {
      const hasDevelopers = this.isRank('developers')
      const hasSupporters = this.isRank('supporters')
      const hasAlpha = this.isRank('alpha')
      const hasContributors = this.isRank('contributors')
      return !hasDevelopers && !hasSupporters && !hasAlpha && !hasContributors
    }
  },
  data () {
    return {
      developers: [
        '0xD02248C262b3690CC6eE73D24F5f2F19095585Fb',
        '0xaf77cf319CB4f0597e5bB0974E8981fAe49Ea4A9'
      ],
      supporters: [
        '0xaf77cf319CB4f0597e5bB0974E8981fAe49Ea4A9',
        '0xD02248C262b3690CC6eE73D24F5f2F19095585Fb',
        '0x61E0E9ADe660551cd78B584Fb54d492CaEAAaD55',
        '0xA0eAf1961243E3708bAe85927D2645D8f8e8cC67'
      ],
      alpha: [
        '0xaf77cf319CB4f0597e5bB0974E8981fAe49Ea4A9',
        '0xD02248C262b3690CC6eE73D24F5f2F19095585Fb',
        '0x31BaEc09bb1628A17A9A99dABA11e9Ca75493Fd1',
        '0x61E0E9ADe660551cd78B584Fb54d492CaEAAaD55',
        '0x8AE982dFE0A0B725A4e385d8FA22BaDd69Eb3e1F',
        '0x738cD984d5B49e2e6CF11660fa2Ee568FAad6a0b',
        '0xA0eAf1961243E3708bAe85927D2645D8f8e8cC67',
        '0x7Ec83F5A35848E5337380253f03dfCca6Fba7B73',
        '0x834C14352a8Ee4f8005aBD3d6d4359B47dDf7767',
        '0x200D44F3661688ded837132556cF51b4F94dB7a6',
        '0xd4942c9844F53b864206144dFFf97541091DB15B',
        '0x68BB61130Abc842c0191523299e4Dd1Bbe21784b',
        '0x4116b121B9908a264163A95493D61Ea5b6114bFa',
        '0x3dbe98400eD635943D06569414775d05F9ED205f',
        '0x24da33427bD1076BBb956A2e804a76e5D9611344',
        '0x703f98Ca66BfB4Dbc9922A9001F88c6AC7AD1cF9',
        '0x5398Ee2D0964f210Dc0902c1CcB9e0BeD667A9a7',
        '0xBD4c98E51872172E5dE259E48B1f74a115AbF45B',
        '0xD4cA48706CAf708cB6BA463Ae8e8B030140fa01b',
        '0x43E2b23C1199a29bF2781DeAdA0aAc608419B430',
        '0x1aDe7295759574ecC7887A9B76844939B38eE315',
        '0xb4140b42710029B35d6D6C0987ca1Ca2c8cFA1FA',
        '0x89edFCDB7A1A34DF43A129b239020701d25E8A10',
        '0xB94952AF176401365d85096F8d463E32b39e9EC8',
        '0x7ccaEBA528A581b34954D72087b611883F58Cf20',
        '0x47130b1937f8E68A674C00C618cb5743f74404b3',
        '0x0Ab2787797eF974DF6F739A2195E463D2f17763E'
      ],
      contributors: [
        '0xaf77cf319CB4f0597e5bB0974E8981fAe49Ea4A9',
        '0x1aDe7295759574ecC7887A9B76844939B38eE315',
        '0x7Ec83F5A35848E5337380253f03dfCca6Fba7B73'
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Badge.less">
</style>
