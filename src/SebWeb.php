<?php

class SebWeb {
	
	public static $DEFAULT_ARTICLE = 'frontpage.html';
	public static $ERROR_404_ARTICLE = '404notfound.html';
	
	public $activeArticles = [];
	
	public function setActiveArticle($article) {
		$this->activeArticles[0] = $article;
	}
	
	public function setActiveArticles($articles) {
		$this->activeArticles = $articles;
	}
	
	public function addActiveArticle($article) {
		$this->activeArticles[] = $article;
	}
	
	public function getActiveArticles() {
		return Article::get($this->getRoute());
	}
	
	public function renderContent() {
		$articles = $this->getActiveArticles();
		
		foreach($articles as $article) {
			echo $article->getContent();
		}
	}
	
	public function setMainMenu($array) {
		$this->mainMenu = $array;
	}
	
	public function renderMainMenu() {
		echo "<ul>\n";
		foreach($this->mainMenu as $q => $label) {
			$menuItem = new MenuItem($q, $label);
			echo '<li>';
			$menuItem->render();
			echo "</li>\n";
		}
		echo '</ul>';
	}
	
	/* */
	public function getRoute() {
		if(empty($_GET['q'])) {
			return self::$DEFAULT_ARTICLE;
		}
		
		if(file_exists(ARTICLES_PATH . $_GET['q'])) {
			return $_GET['q'];
		} else {
			return self::$ERROR_404_ARTICLE;
		}
	}
}

?>