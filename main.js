const formatReddit = (reddit) => {
  const { subreddit, selftext, url, title } = reddit.data

  return {
    title,
    subreddit,
    selftext,
    url,
  }
}

const fetchPosts = async (url) => {
  const { status, data } = await axios.get(url)
  if (status === 200) {
    const posts = data.data.children
    return posts
  }
  return []
}

const tryFetchPosts = async (url) => {
  try {
    return await fetchPosts(url)
  } catch (_) {
    return []
  }
}

const filterPostBy = (posts, filters) => {
  const resulst = posts.filter((post) => {
    const filtersArray = filters.split('|')

    for (const filter of filtersArray) {
      const regex = new RegExp(`\\b${filter.toLowerCase()}\\b`)

      const titleInLowerCase = post.data.title.toLowerCase()
      if (regex.test(titleInLowerCase)) {
        return true
      }
      const selftextInLowerCase = post.data.selftext.toLowerCase()
      if (regex.test(selftextInLowerCase)) {
        return true
      }
    }

    return false
  })

  return resulst
}

const mainWorkyTest = async () => {
  const BASE_URL = 'https://www.reddit.com/r/lotr.json?limit=100'
  const hobbits = [
    'Frodo',
    'Bilbo',
    'Samsagaz|Sam',
    'Meriadoc|Merry',
    'Peregrin|Pippin',
    'Smeagol|Gollum',
  ]
  const lotrReddits = await tryFetchPosts(BASE_URL)
  const postByHobbit = []
  for (const hobbit of hobbits) {
    const posts = filterPostBy(lotrReddits, hobbit)
    const postsFormmated = posts.map((post) => formatReddit(post))
    postByHobbit.push({ hobbit, total: posts.length, posts: postsFormmated })
    console.log('-----------------------------------')
    console.log(`Hobbit:  ${hobbit} - Total: ${posts.length}`)
    postsFormmated.map((post) => console.table(post))
  }

  //Sort
  postByHobbit.sort((a, b) => {
    //First criteria: Sort by total posts
    if (a.total > b.total) return -1
    if (a.total < b.total) return 1

    //Second criteria: Sort alphabetically
    return a.hobbit.localeCompare(b.hobbit)
  })

  const [top] = postByHobbit

  console.log('Hobbit con m??s posts: ', top.hobbit)
  return postByHobbit
}
