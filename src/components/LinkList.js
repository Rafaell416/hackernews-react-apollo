import React, { Component } from 'react'
import { graphql, gql } from 'react-apollo'
import Link from './Link'

class LinkList extends Component {

  _subscribeToNewLinks = () => {
    this.props.allLinksQuery.subscribeToMore({
      document: gql`
        subscription {
          Link(filter: {
            mutation_in: [CREATED]
          }) {
            node {
              id
              url
              description
              createdAt
            }
          }
        }
      `,
      updateQuery: (previous, { subscriptionData }) => {
        const newAllLinks = [
          subscriptionData.data.Link.node,
          ...previous.allLinks
        ]
        const result = {
          ...previous,
          allLinks: newAllLinks
        }
        return result
      }
    })
  }

  componentDidMount() {
    this._subscribeToNewLinks()
  }

  render() {

  if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
    return <div>Loading</div>
  }

  if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
    return <div>Error</div>
  }

  const linksToRender = this.props.allLinksQuery.allLinks

  return (
    <div>
      {linksToRender.map(link => (
        <Link key={link.id} link={link}/>
      ))}
    </div>
  )
}

}


// 1
const ALL_LINKS_QUERY = gql`
  # 2
  query AllLinksQuery {
    allLinks {
      id
      createdAt
      url
      description
    }
  }
`

// 3
export default graphql(ALL_LINKS_QUERY, { name: 'allLinksQuery' }) (LinkList)
