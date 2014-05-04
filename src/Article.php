<?php

define('ARTICLES_PATH', dirname(dirname(__FILE__)) . '/articles/');

class Article {
	protected $content = '';
	protected $filename = '';
	
	function Article($filepath) {
		$this->content = file_get_contents($filepath);
		$this->filename = basename($filepath);
	}
	
	public function getFilename() {
		return $this->filename;
	}
	
	public function setFilename($filename) {
		$this->filename = $filename;
	}
	
	public function getContent() {
		return $this->content;
	}
	
	public function setContent($content) {
		$this->content = $content;
	}
	
	public static function get($q) {
		$articles = [];
		
		/* If filepath ends with .html load one file, otherwise 
		 * load a folder. */
		$htmlEndingPattern = '/.*.html$/';
		if(preg_match($htmlEndingPattern,$q)) {
			
			$filepath = ARTICLES_PATH . $q;
			if(!file_exists($filepath)) {
				$articles = False;
			} else {
				$article = new Article($filepath);
				$articles[] = $article;
			}
			
		} else {
			foreach(glob(ARTICLES_PATH . $q . '/*.html') as $filepath) {
				$article = new Article($filepath);
				
				$articles[] = $article;
			}
			
		}
		
		return $articles;
	}
}

?>
