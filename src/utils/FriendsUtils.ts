import sortBy from 'lodash/sortBy'
import groupBy from 'lodash/groupBy'
import Fuse from 'fuse.js'

/** @method
 * Sort friends by name and groups them by the first
 * letter of the name
 * @name getAlphaSorted
 * @param friends array of friends
 */
export function getAlphaSorted (friends: Array<any>) {
  const sorted = sortBy(friends, ['name'])
  const grouped = groupBy(sorted, f => {
    if (f.name && f.name.length) {
      return f.name.toUpperCase()[0]
    } else {
      return '-'
    }
  })

  return grouped
}

/** @method
 * Filter friends by stored keyword and
 * rebind the friends data
 * @name filterFriends
 * @param friends Array of friends to filter
 * @param keyword string keyword to search for
 */
export function getFilteredFriends (friends: Array<any>, keyword: string) {
  if (keyword) {
    const options = {
      includeScore: false,
      keys: ['name']
    }
    const fuse = new Fuse(friends, options)
    const result = fuse.search(keyword)
    return result.map(i => i.item)
  } else {
    return friends
  }
}
