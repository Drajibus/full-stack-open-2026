import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Made-up author for test',
  url: 'http://fake_url.com',
  likes: 42,
  user: 'a user',
}

let mockHandler

describe('<Blog />', () => {
  beforeEach(() => {
    mockHandler = vi.fn()
    render(<Blog blog={blog} updateLikes={mockHandler} />)
  })

  test('renders title', () => {
    const element = screen.getByText(
      'Component testing is done with react-testing-library',
      { exact: false }
    )

    expect(element).toBeDefined()
  })

  test('renders author', () => {
    const element = screen.getByText('Made-up author for test', {
      exact: false,
    })

    expect(element).toBeDefined()
  })

  test('does not render url if no clicks on view', () => {
    const element = screen.getByText('http://fake_url.com')

    expect(element).not.toBeVisible()
  })

  test('does not render likes if no clicks on view', () => {
    const element = screen.getByText('likes 42')

    expect(element).not.toBeVisible()
  })

  test('renders url when user cliked on view', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const element = screen.getByText('http://fake_url.com')

    expect(element).toBeVisible()
  })

  test('renders likes when user cliked on view', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const element = screen.getByText('likes 42')

    expect(element).toBeVisible()
  })

  test('when user clicks 2 times on like, the handler received as props should be called 2 times', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')

    expect(likeButton).toBeVisible()

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
