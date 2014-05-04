<?php
use AspectMock\Test as test;

class SebWebTest extends \PHPUnit_Framework_TestCase {
	
	public function setUp() {
		$this->sebWeb = new SebWeb();
		
		$this->mainMenu = [
					'test_article.html' => 'Test Article',
					'test_blog' => 'Test Blog'
					];
	}
	
	public function getArticleMock($getContentReturn) {
		$article = $this->getMockBuilder('Article')
						->disableOriginalConstructor()
						->getMock();
		
		$article->expects($this->any())
				->method('getContent')
				->will($this->returnValue($getContentReturn));
		
		return $article;
	}
	
	/* 
	 * ->renderContent() 
	 * Renders content from a set of active articles.
	 */
	public function testRenderContentRendersActiveContent() {
		/* Mock article to render */
		$expected = 'Blargh';
		$article = $this->getArticleMock($expected);
		
		/* Mock the getActiveArticles() method to avoid using Article::get() */
		$this->sebWeb = $this->getMock('SebWeb', ['getActiveArticles']);
		$this->sebWeb->expects($this->any())
					 ->method('getActiveArticles')
					 ->will($this->returnValue([$article]));
		
		$this->expectOutputString($expected);
		$this->sebWeb->renderContent();
	}
	public function testRenderContentRendersSeveralActiveArticles() {
		$expected1 = 'Blargh';
		$article1 = $this->getArticleMock($expected1);
		$expected2 = 'Honk';
		$article2 = $this->getArticleMock($expected2);
		
		$this->sebWeb = $this->getMock('SebWeb', ['getActiveArticles']);
		$this->sebWeb->expects($this->any())
					 ->method('getActiveArticles')
					 ->will($this->returnValue([$article1, $article2]));
		
		$regex = '/.*'.$expected1.'.*\n*.*'.$expected2.'.*/';
		$this->expectOutputRegex($regex);
		$this->sebWeb->renderContent();
	}
	
	/* 
	 * ->getRoute()
	 * Converts the GET['q']-variable into a route to the appropriate article.
	 */
	public function testRouteReturnsArticleFilenameWhenArticleExists() {
		$_GET['q'] = 'test_article.html';
		
		$this->assertEquals($this->sebWeb->getRoute(), $_GET['q']);
	}
	public function testRouteReturns404WhenArticleDoesntExist() {
		$_GET['q'] = 'articlethatdoesnotexist';
		
		$this->assertEquals($this->sebWeb->getRoute(),
							SebWeb::$ERROR_404_ARTICLE);
	}
	public function testRouteReturnsDefaultArticleWhenArticleUnspecified() {
		$_GET['q'] = '';
		
		$this->assertEquals($this->sebWeb->getRoute(), SebWeb::$DEFAULT_ARTICLE);
	}
	
	/* 
	 * ->renderMainMenu()
	 * Renders list of main menu items
	 */
	public function testRenderMainMenuRendersListOfLinksGivenAnArray() {
		/* This regex will allow the following pattern (try it on Rubular.com):
		 * <ul>
		 * <li><a href="blargh.html">Blargh</a></li>
		 * <li><a href="honk" class="active">Blargh Honk</a></li>
		 * </ul>
		 */
		
		$regex = '/<ul>\n(<li>(<a href=".*".*>[\w|\s]*<\/a>)<\/li>\n){2}<\/ul>/';
		$this->expectOutputRegex($regex);
		
		$this->sebWeb->setMainMenu($this->mainMenu);
		$this->sebWeb->renderMainMenu();
	}
}

?>