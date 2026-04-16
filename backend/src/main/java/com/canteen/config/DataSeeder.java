package com.canteen.config;

import com.canteen.model.MenuItem;
import com.canteen.model.User;
import com.canteen.repository.MenuItemRepository;
import com.canteen.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@canteen.com");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            admin.setBalance(9999.0);
            userRepository.save(admin);

            User student = new User();
            student.setName("Student");
            student.setEmail("student@canteen.com");
            student.setPassword("password");
            student.setRole("USER");
            student.setBalance(500.0);
            userRepository.save(student);

            MenuItem item1 = new MenuItem();
            item1.setName("Classic Burger");
            item1.setDescription("Juicy beef patty with fresh lettuce, tomatoes, and house sauce.");
            item1.setPrice(150.0);
            item1.setImageUrl("🍔");
            item1.setCategory("Burgers");
            item1.setStockQuantity(20);
            menuItemRepository.save(item1);

            MenuItem item2 = new MenuItem();
            item2.setName("Margherita Pizza");
            item2.setDescription("Classic cheese and tomato pizza with basil.");
            item2.setPrice(250.0);
            item2.setImageUrl("🍕");
            item2.setCategory("Pizzas");
            item2.setStockQuantity(15);
            menuItemRepository.save(item2);

            MenuItem item3 = new MenuItem();
            item3.setName("Iced Coffee");
            item3.setDescription("Refreshing cold brew coffee with a hint of vanilla.");
            item3.setPrice(100.0);
            item3.setImageUrl("☕");
            item3.setCategory("Beverages");
            item3.setStockQuantity(30);
            menuItemRepository.save(item3);
            
            MenuItem item4 = new MenuItem();
            item4.setName("French Fries");
            item4.setDescription("Crispy golden french fries.");
            item4.setPrice(80.0);
            item4.setImageUrl("🍟");
            item4.setCategory("Snacks");
            item4.setStockQuantity(50);
            menuItemRepository.save(item4);
        }
    }
}
