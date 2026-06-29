import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

const blog = {
  title: 'Component testing is done with react-testing-library',
  author: 'Made-up author for test',
  url: 'http://fake_url.com',
  likes: 42,
  user: 'a user',
}

describe('<Blog />', () => {
  beforeEach(() => {
    render(<Blog blog={blog} />)
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

  test('does not render url if no click on details', () => {
    const element = screen.getByText('http://fake_url.com')

    expect(element).not.toBeVisible()
  })

  test('does not render likes if no click on details', () => {
    const element = screen.getByText('likes 42')

    expect(element).not.toBeVisible()
  })
})
