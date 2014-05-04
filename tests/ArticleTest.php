<?php

class ArticleTest extends PHPUnit_Framework_TestCase {
	public function setUp() {
		
	}
	
	/* ::get() */
	public function testGetReturnsArticleWithContent() {
		$article = Article::get('test_article.html')[0];
		$this->assertStringEqualsFile(
				__DIR__ . '/../articles/test_article.html', 
				$article->getContent());
	}
	public function testGetReturnsArticleWithFilename() {
		$article = Article::get('test_article.html')[0];
		$this->assertEquals($article->getFilename(),'test_article.html');
	}
	public function testGetReturnsFalseWhenArticleNotFound() {
		$articles = Article::get('article_that_doesnt_exist.html');
		$this->assertFalse($articles);
	}
	public function testGetReturnsAllArticlesInFolderWhenFolderSpecified() {
		$articles = Article::get('test_blog');
		
		$this->assertEquals($articles[0]->getFilename(), 'test_post1.html');
		$this->assertEquals($articles[1]->getFilename(), 'test_post2.html');
	}
}
