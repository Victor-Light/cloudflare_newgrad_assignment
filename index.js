addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
const Links =[
  { "name": "facebook", "url": "https://www.facebook.com/" },
  { "name": "pinterest", "url": "https://www.pinterest.com/" },
  { "name": "twitter", "url": "https://twitter.com/" },
  { "name": "instagram", "url": "https://www.instagram.com/"}
];

async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    const id = element.getAttribute('id')
    if (id === 'links') {
      let content = ''
      Links.forEach(item => content += '<a href="' + item.url + '">' + item.name + '</a>')
      element.setInnerContent(content, { html: true })
    }
    if (id === 'name') {
      element.setInnerContent('yuanzhao-li', { html: true })
    }
    if (id === 'profile') {
      element.setAttribute('style', '')
    }
    if (id === 'avatar') {
      element.setAttribute(
        'src',
        'https://avatars.githubusercontent.com/Victor-Light',
      )
    }
    if (id === 'social') {
      element.setAttribute('style', '')
    }
    if (element.tagName === 'body') {
      element.setAttribute('class', 'bg-gray-900')
    }
    if (element.tagName === 'title') {
      element.setInnerContent('yuanzhao-li', { html: true })
    }
  }
}

async function handleRequest(request) {
  let requestURL = new URL(request.url)
  let path       = requestURL.pathname.split("/")[1]
  if (path === "links") {
    return new Response(JSON.stringify(Links), {
        headers: {
          "content-type": "application/json;charset=UTF-8"
        }
      })
  }
  // handle url paths are not links
  const HostUrl = "https://static-links-page.signalnerve.workers.dev"
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }
  const response = await fetch(HostUrl, init)
  const htmlRewriter = new HTMLRewriter().on("*", new LinksTransformer(Links))
  const html = await htmlRewriter.transform(response)
  const results = await gatherResponse(html)

  return new Response(results, init)
}
