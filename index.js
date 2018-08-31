const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { find } = require('lodash');

const app = express();
const books = [
	{
		id: '01',
		language: 'Java',
		edition: 'third',
		authorId: '21',
	},
	{
		id: '07',
		language: 'C++',
		edition: 'second',
		authorId: '11',
	},
];
const authors = [
	{
		id: '21',
		name: 'Herbet Schildt',
	},
	{
		id: '11',
		name: 'E.Balagurusamy',
	},
];

// Schema for your graphql
const typeDefs = gql`
	type Query {
		hello: String
		allBooks: [Book]
		book(id: String): Book
		author(id: String): Author
	}
	type Book {
		id: String
		language: String
		edition: String
		author: Author
	}
	type Author {
		id: String
		name: String
		book: Book
	}
`;

const resolvers = {
	Query: {
		hello: function() {
			return 'Hello World!';
		},
		allBooks: () => books,
		book: (_, args) => find(books, { id: args.id }),
		author: (_, args) => find(authors, { id: args.id }),
	},
	Book: {
		author: book => find(authors, { id: book.authorId }),
	},
	Author: {
		book: author => find(books, { authorId: author.id }),
	},
};
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

server.applyMiddleware({ app });

app.listen(7000, () => {
	console.log('Server running at port 7000');
});
