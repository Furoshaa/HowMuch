import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function NavBar() {
    const location = useLocation();
    
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                {/* Brand */}
                <div className="mr-6 flex items-center space-x-2">
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            HowMuch
                        </span>
                    </Link>
                </div>
                
                {/* Main Navigation */}
                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    location.pathname === '/' && "bg-accent text-accent-foreground"
                                )}
                            >
                                <Link to="/">Home</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        
                        <NavigationMenuItem>
                            <NavigationMenuTrigger 
                                className={location.pathname.startsWith('/users') || location.pathname.startsWith('/schedules') ? "bg-accent text-accent-foreground" : ""}
                            >
                                Management
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <Link
                                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                                to="/"
                                            >
                                                <div className="mb-2 mt-4 text-lg font-medium">
                                                    HowMuch
                                                </div>
                                                <p className="text-sm leading-tight text-muted-foreground">
                                                    Manage your work schedules, users, and track time efficiently.
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                to="/users"
                                                className={cn(
                                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                                    location.pathname === '/users' && "bg-accent text-accent-foreground"
                                                )}
                                            >
                                                <div className="text-sm font-medium leading-none">Users</div>
                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                    Manage user accounts and profiles
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                to="/schedules"
                                                className={cn(
                                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                                    location.pathname === '/schedules' && "bg-accent text-accent-foreground"
                                                )}
                                            >
                                                <div className="text-sm font-medium leading-none">Schedules</div>
                                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                    View and manage work schedules
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    location.pathname === '/test' && "bg-accent text-accent-foreground"
                                )}
                            >
                                <Link to="/test">Test</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                
                {/* Mobile Navigation */}
                <div className="flex md:hidden">
                    <select 
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={location.pathname}
                        onChange={(e) => window.location.href = e.target.value}
                    >
                        <option value="/">Home</option>
                        <option value="/users">Users</option>
                        <option value="/schedules">Schedules</option>
                        <option value="/test">Test</option>
                    </select>
                </div>
                
                {/* Auth Buttons */}
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        asChild
                        className={location.pathname === '/login' ? "bg-accent text-accent-foreground" : ""}
                    >
                        <Link to="/login">Login</Link>
                    </Button>
                    <Button 
                        size="sm"
                        asChild
                        className={location.pathname === '/register' ? "bg-primary/90" : ""}
                    >
                        <Link to="/register">Register</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}

export default NavBar;