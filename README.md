# 430-project-1

GTFO Weapon Assistant is a tool that GTFO players can use to optimize loadouts. After selecting a weapon, the web page will display a list of statistics as well as efficient usages of each weapon.

## Endpoints:

- `/api/weapons`
	Methods: GET, HEAD
	Description: retrieve a list of all weapons and their thumbnails
	Returns: JSON
- `/api/main_weapon_stats`
	Methods: GET, HEAD
	Description: retrieve a list of main weapon stats
	Returns: JSON
- `/api/special_weapon_stats`
	Methods: GET, HEAD
	Description: retrieve a list of special weapon stats
	Returns: JSON
- `/api/categories`
	Methods: GET, HEAD
Description: retrieve a list of searchable categories (unused in final prototype)
	Returns: JSON
- `/api/enemies`
	Methods: GET, HEAD
	Description: retrieve a list of all enemies
	Returns: JSON
- `/api/enemy_stats`
	Methods: GET, HEAD
	Description: retrieve a list of all enemy stats
	Returns: JSON
- `/comments`
	Methods: GET, HEAD
	Description: retrieve a list of all comments
	Returns: JSON
- `/add_comment`
	Methods: POST
	Description: post a comment to the server
	Data: JSON
