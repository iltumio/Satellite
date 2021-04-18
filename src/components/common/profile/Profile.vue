<template>
  <div class="modal is-active">
    <button class="modal-close is-large" aria-label="close" v-on:click="$store.commit('viewProfile', false)"></button>
    <div class="modal-background"></div>
    <div class="modal-card">
        <section class="modal-card-body">
            <!-- Profile Header BG -->
            <div class="profile-header-bg">
                <div class="username-container">
                    <h1>Sophie Du'Claire <i class="fas fa-badge-check verified-badge"></i></h1>
                    <p>Vibin' in orbit, connected from above.</p>
                </div>
            </div>
            <div class="profile-photo">
                <img src="https://avatarfiles.alphacoders.com/208/208557.png" alt="">
            </div>
            <div class="quick-actions">
                <button class="button is-primary is-outlined" v-on:click="chatFriend">
                    <i class="fas fa-comment-alt-dots"></i> &nbsp; Message
                </button>
                <button class="button is-primary is-outlined">
                    <i class="fas fa-phone"></i> &nbsp; Call
                </button>
                <button class="button is-primary is-outlined">
                    <i class="fas fa-share-square"></i> &nbsp; Share
                </button>
            </div>
            <div class="note-holder">
                <span class="label">{{ $t('conversation.userinfo.notes') }}</span>
                <textarea
                    class="textarea"
                    :placeholder="$t('conversation.userinfo.notes_placeholder')"
                    v-model="$store.state.userNotes[$store.state.viewingProfile]"
                ></textarea>
            </div>
        </section>
    </div>
    </div>
</template>

<script>
export default {
    name: 'Profile',
    methods: {
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
    }
}
</script>

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
            background-image: url(https://st2.depositphotos.com/3584689/10433/i/600/depositphotos_104333588-stock-photo-landscape-painting-of-sci-fi.jpg);
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