<?php

class MenuItemTest extends PHPUnit_Framework_TestCase {
	
	public function setUp() {
		$this->link = 'test_article.html';
		$this->label = 'Test Article';
		$this->menuItem = new MenuItem($this->link, $this->label);
	}
	
	/* Constructor */
	public function testMenuItemGeneratesCorrectLink() {
		$this->assertEquals($this->menuItem->getLink(), '?q='.$this->link);
	}
	public function testMenuItemGeneratesCorrectLabel() {
		$this->assertEquals($this->menuItem->getLabel(), $this->label);
	}
	
	/* ->render() */
	public function testMenuItemRendersInactiveLinkWithoutSpecialCSS() {
		$expected = '<a href="?q=' . $this->link . '">' . $this->label . '</a>';
		$this->expectOutputString($expected);
		
		$this->menuItem->render();
	}
	public function testMenuItemRendersActiveLinkWithSpecialCSS() {
		$_GET['q'] = 'test_article.html';
		
		$expected = '<a href="?q=' . $this->link . '" class="active">' . $this->label . '</a>';
		$this->expectOutputString($expected);
		
		$this->menuItem->render();
	}
}

?>